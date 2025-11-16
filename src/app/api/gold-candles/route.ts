import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const days = parseInt(searchParams.get('days') || '30', 10)
    let range = '1mo', interval = '1d'
    if (days <= 7) { range = '7d'; interval = '1h' }
    else if (days <= 30) { range = '1mo'; interval = '1d' }
    else if (days <= 90) { range = '3mo'; interval = '1d' }
    else if (days <= 365) { range = '1y'; interval = '1d' }
    else { range = '2y'; interval = '1d' }

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/GC=F?range=${range}&interval=${interval}&includePrePost=false`
    const r = await fetch(url, { headers: { 'Accept':'application/json' }, cache: 'no-store' })
    if (!r.ok) return NextResponse.json({ error: 'upstream_error' }, { status: r.status })
    const data = await r.json()
    const result = data && data.chart && data.chart.result && data.chart.result[0]
    if (!result) return NextResponse.json({ error: 'no_result' }, { status: 502 })
    const timestamps = result.timestamp || []
    const quote = result.indicators && result.indicators.quote && result.indicators.quote[0] || {}
    const out: any[] = []
    for (let i=0; i<timestamps.length; i++){
      const o = quote.open && quote.open[i]
      const h = quote.high && quote.high[i]
      const l = quote.low && quote.low[i]
      const c = quote.close && quote.close[i]
      if ([o,h,l,c].every(v=> typeof v === 'number' && isFinite(v))) out.push({ time: timestamps[i], open:o, high:h, low:l, close:c })
    }
    return NextResponse.json(out)
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}