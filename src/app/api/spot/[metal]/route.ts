import { NextResponse, NextRequest } from 'next/server'
export const runtime = 'edge'

function parseUSD(val: any): number | null {
  if (typeof val === 'number') return val
  if (val && typeof val === 'object') return (val.USD || val.usd || Number(Object.values(val)[0])) as number
  return null
}

export async function GET(_req: NextRequest, { params }: { params: { metal: string } }) {
  try {
    const metalMap: Record<string, { symbol: 'XAU'|'XAG'|'XPT'; metalsLive: 'gold'|'silver'|'platinum'; yahoo: string }> = {
      gold: { symbol: 'XAU', metalsLive: 'gold', yahoo: 'GC=F' },
      silver: { symbol: 'XAG', metalsLive: 'silver', yahoo: 'SI=F' },
      platinum: { symbol: 'XPT', metalsLive: 'platinum', yahoo: 'PL=F' },
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
    endpoints.push({ url: `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(m.yahoo)}?range=1d&interval=1h&includePrePost=false`, headers: { 'Accept':'application/json' } })

    const firstResolved = <T,>(promises: Promise<T>[]): Promise<T> => {
      return new Promise<T>((resolve, reject) => {
        let rejected = 0
        const total = promises.length
        promises.forEach(p => {
          p.then(resolve).catch(() => {
            rejected += 1
            if (rejected === total) reject(new Error('all_failed'))
          })
        })
      })
    }
    const withTimeout = <T,>(p: Promise<T>, ms = 3500): Promise<T> => {
      return new Promise<T>((resolve, reject) => {
        const id = setTimeout(() => reject(new Error('timeout')), ms)
        p.then(v => { clearTimeout(id); resolve(v) }).catch(e => { clearTimeout(id); reject(e) })
      })
    }

    const extractPrice = (data: any, key: 'gold'|'silver'|'platinum') => {
      let price: number | null = null
      if (data == null) return null
      if (typeof data === 'number') return data
      // Yahoo Finance chart structure
      try {
        const result = data && data.chart && data.chart.result && data.chart.result[0]
        const quote = result && result.indicators && result.indicators.quote && result.indicators.quote[0]
        const closes = quote && quote.close
        if (Array.isArray(closes)) {
          for (let i = closes.length - 1; i >= 0; i--) {
            if (typeof closes[i] === 'number' && isFinite(closes[i])) return closes[i] as number
          }
        }
      } catch {}
      if (Array.isArray(data)) {
        const last = data[data.length-1]
        if (typeof last === 'number') price = last
        else if (Array.isArray(last)) { const nums = last.filter((v:any) => typeof v === 'number'); if (nums.length) price = nums[nums.length-1] as number }
        else if (last && typeof last === 'object') {
          price = (last.price as number) || parseUSD(last) || (last[key] as number) || (last.ask as number) || (last.bid as number)
        }
      } else if (typeof data === 'object') {
        price = (data.price as number) || (data.rate as number) || (data.rates && (data.rates.USD as number)) || (data[key] as number) || parseUSD(data)
      }
      return price
    }

    const tasks = endpoints.map(ep => withTimeout(
      fetch(ep.url, { headers: ep.headers, cache: 'no-store' })
        .then(r => { if (!r.ok) throw new Error('bad'); return r.json() })
        .then(data => {
          const price = extractPrice(data, m.metalsLive)
          if (price) return parseFloat(String(price))
          throw new Error('no_price')
        })
    ))
    try {
      const price = await firstResolved(tasks)
      return NextResponse.json({ price })
    } catch {}
    return NextResponse.json({ error: 'no_price' }, { status: 502 })
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}