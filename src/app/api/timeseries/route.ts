import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const start_date = searchParams.get('start_date') || ''
    const end_date = searchParams.get('end_date') || ''
    const metal = searchParams.get('metal') || 'XAU'
    const map: Record<string,string> = { XAU:'XAU', XAG:'XAG', XPT:'XPT', gold:'XAU', silver:'XAG', platinum:'XPT' }
    const base = map[metal] || 'XAU'

    const nasdaqKey = process.env.NASDAQ_API_KEY
    if (base === 'XAU' && nasdaqKey) {
      try {
        const urlNasdaq = `https://data.nasdaq.com/api/v3/datasets/LBMA/GOLD.json?api_key=${encodeURIComponent(nasdaqKey)}&start_date=${encodeURIComponent(start_date)}&end_date=${encodeURIComponent(end_date)}`
        const nr = await fetch(urlNasdaq, { headers: { 'Accept': 'application/json' }, cache: 'no-store' })
        if (nr.ok) {
          const nd = await nr.json()
          const dataset = nd && nd.dataset
          const rows: any[] = (dataset && dataset.data) || []
          const out: any[] = []
          for (const row of rows) {
            const dateStr = row[0]
            const am = typeof row[1] === 'number' ? row[1] : parseFloat(row[1])
            const pm = typeof row[2] === 'number' ? row[2] : parseFloat(row[2])
            const price = Number.isFinite(pm) ? pm : (Number.isFinite(am) ? am : null)
            if (price !== null) {
              const ts = new Date(dateStr).getTime()/1000
              out.push({ price: parseFloat(String(price)), timestamp: ts, date: new Date(ts*1000).toISOString() })
            }
          }
          if (out.length > 0) {
            return NextResponse.json(out.sort((a,b)=>a.timestamp-b.timestamp))
          }
        }
      } catch {}
    }

    

    // Fallback 1: exchangerate.host (may not support metals fully; try but tolerate empty)
    try {
      const freeUrl = `https://api.exchangerate.host/timeseries?start_date=${encodeURIComponent(start_date)}&end_date=${encodeURIComponent(end_date)}&base=${base}&symbols=USD`
      const fr = await fetch(freeUrl, { headers: { 'Accept': 'application/json' }, cache: 'no-store' })
      if (fr.ok) {
        const d2 = await fr.json()
        const out: any[] = []
        if (d2 && d2.rates) {
          Object.keys(d2.rates).sort().forEach(k => {
            const val = d2.rates[k] && d2.rates[k].USD
            if (val) { const ts = new Date(k).getTime()/1000; out.push({ price: parseFloat(String(val)), timestamp: ts, date: new Date(ts*1000).toISOString() }) }
          })
        }
        if (out.length) return NextResponse.json(out)
      }
    } catch {}

    // Fallback 2: Yahoo Finance chart (GC=F for gold, SI=F silver, PL=F platinum)
    const yahooMap: Record<string,string> = { XAU:'GC=F', XAG:'SI=F', XPT:'PL=F' }
    const symbol = yahooMap[base] || 'GC=F'
    try {
      const msPerDay = 24*60*60*1000
      const s = new Date(start_date)
      const e = new Date(end_date)
      const days = Math.max(1, Math.round((e.getTime()-s.getTime())/msPerDay)+1)
      let range = '1mo'
      if (days <= 7) range = '7d'
      else if (days <= 30) range = '1mo'
      else if (days <= 90) range = '3mo'
      else if (days <= 365) range = '1y'
      else range = '2y'
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=1d&includePrePost=false`
      const rr = await fetch(url, { headers: { 'Accept': 'application/json' }, cache: 'no-store' })
      if (rr.ok) {
        const data = await rr.json()
        const result = data && data.chart && data.chart.result && data.chart.result[0]
        const timestamps: number[] = (result && result.timestamp) || []
        const quote = result && result.indicators && result.indicators.quote && result.indicators.quote[0] || {}
        const closes: number[] = (quote && quote.close) || []
        const out: any[] = []
        for (let i=0;i<timestamps.length;i++){
          const c = closes[i]
          if (typeof c === 'number' && isFinite(c)){
            const dStr = new Date(timestamps[i]*1000).toISOString().slice(0,10)
            if (dStr >= start_date && dStr <= end_date){
              out.push({ price: parseFloat(String(c)), timestamp: timestamps[i], date: new Date(timestamps[i]*1000).toISOString() })
            }
          }
        }
        if (out.length) return NextResponse.json(out.sort((a,b)=>a.timestamp-b.timestamp))
      }
    } catch {}

    return NextResponse.json([], { status: 200 })
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}