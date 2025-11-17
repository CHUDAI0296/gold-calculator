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
      return NextResponse.json(out)
    }

    return NextResponse.json([], { status: 200 })
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}