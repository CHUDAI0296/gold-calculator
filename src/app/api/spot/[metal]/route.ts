import { NextResponse, NextRequest } from 'next/server'

function parseUSD(val: any): number | null {
  if (typeof val === 'number') return val
  if (val && typeof val === 'object') return (val.USD || val.usd || Number(Object.values(val)[0])) as number
  return null
}

export async function GET(_req: NextRequest, { params }: { params: { metal: string } }) {
  try {
    const metalMap: Record<string, { symbol: 'XAU'|'XAG'|'XPT'; metalsLive: 'gold'|'silver'|'platinum' }> = {
      gold: { symbol: 'XAU', metalsLive: 'gold' },
      silver: { symbol: 'XAG', metalsLive: 'silver' },
      platinum: { symbol: 'XPT', metalsLive: 'platinum' },
    }
    const m = metalMap[params.metal]
    if (!m) return NextResponse.json({ error: 'invalid_metal' }, { status: 400 })
    const goldToken = process.env.GOLDAPI_TOKEN
    const endpoints: { url: string; headers: Record<string,string> }[] = []
    if (goldToken) {
      endpoints.push({ url: `https://api.goldapi.net/v1/price/${m.symbol}/USD`, headers: { 'x-access-token': goldToken, 'Accept':'application/json' } })
      endpoints.push({ url: `https://www.goldapi.io/api/${m.symbol}/USD`, headers: { 'x-access-token': goldToken, 'Accept':'application/json' } })
    }
    endpoints.push({ url: `https://api.metals.live/v1/spot/${m.metalsLive}`, headers: { 'Accept':'application/json' } })
    endpoints.push({ url: `https://api.exchangerate.host/latest?base=${m.symbol}&symbols=USD`, headers: { 'Accept':'application/json' } })
    const tickerMap: Record<string,string> = { XAU:'GC=F', XAG:'SI=F', XPT:'PL=F' }
    const yfTicker = tickerMap[m.symbol]
    endpoints.push({ url: `https://query1.finance.yahoo.com/v8/finance/chart/${yfTicker}?range=1d&interval=1m&includePrePost=false`, headers: { 'Accept':'application/json' } })

    for (const ep of endpoints) {
      try {
        const r = await fetch(ep.url, { headers: ep.headers, cache: 'no-store' })
        if (!r.ok) continue
        const data = await r.json()
        let price: number | null = null
        if (Array.isArray(data)) {
          const last = data[data.length-1]
          if (typeof last === 'number') price = last
          else if (Array.isArray(last)) { const nums = last.filter(v => typeof v === 'number'); if (nums.length) price = nums[nums.length-1] as number }
          else if (last && typeof last === 'object') { price = (last.price as number) || parseUSD(last) }
        } else {
          // standard shapes
          price = (data.price as number) || (data.rate as number) || (data.rates && (data.rates.USD as number)) || parseUSD(data)
          // yahoo finance shape
          if (!price && data && data.chart && data.chart.result && data.chart.result[0]) {
            const result = data.chart.result[0]
            const meta = result.meta || {}
            const regular = meta.regularMarketPrice as number
            const quote = result.indicators && result.indicators.quote && result.indicators.quote[0] || {}
            const closes = quote.close || []
            if (typeof regular === 'number' && isFinite(regular)) price = regular
            else if (Array.isArray(closes) && closes.length) {
              const lastClose = closes.filter((v:any)=> typeof v === 'number' && isFinite(v)).pop()
              if (typeof lastClose === 'number') price = lastClose
            }
          }
        }
        if (price) return NextResponse.json({ price: parseFloat(String(price)) })
      } catch { continue }
    }
    return NextResponse.json({ error: 'no_price' }, { status: 502 })
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}