import { NextResponse } from 'next/server'
export const runtime = 'edge'

async function fetchWithTimeout(url: string, ms = 3000): Promise<any> {
  const ctrl = new AbortController()
  const id = setTimeout(() => ctrl.abort(), ms)
  try {
    const r = await fetch(url, { signal: ctrl.signal, headers: { 'Accept':'application/json' }, cache: 'no-store' })
    if (!r.ok) throw new Error('bad')
    return await r.json()
  } finally { clearTimeout(id) }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const raw = (searchParams.get('symbols') || 'USD,CNY,GBP,EUR').split(',').map(s => s.trim().toUpperCase()).filter(Boolean)
    const symbols = Array.from(new Set(['USD', ...raw]))

    // Primary source: exchangerate.host
    const url1 = `https://api.exchangerate.host/latest?base=USD&symbols=${encodeURIComponent(symbols.join(','))}`
    // Fallback source: open.er-api
    const url2 = `https://open.er-api.com/v6/latest/USD`

    let data: any | null = null
    try {
      data = await fetchWithTimeout(url1)
    } catch {
      try { data = await fetchWithTimeout(url2) } catch {}
    }
    if (!data) return NextResponse.json({ error: 'no_rates' }, { status: 502 })

    const ratesObj = data.rates || data.result || data
    const rates: Record<string, number> = {}
    for (const s of symbols) {
      const v = ratesObj[s]
      if (typeof v === 'number' && isFinite(v)) rates[s] = v
    }
    rates['USD'] = 1
    return NextResponse.json({ base: 'USD', rates })
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}

