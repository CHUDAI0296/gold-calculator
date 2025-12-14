import React from "react";
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd';

function timeAgo(ts: number){
  const diff = Date.now() - ts; const m = 60*1000, h=60*m, d=24*h
  if (diff < h) return `${Math.max(1, Math.round(diff/m))} minutes ago`
  if (diff < d) return `${Math.round(diff/h)} hours ago`
  return `${Math.round(diff/d)} days ago`
}

function extractTags(title: string){
  const t = title.toLowerCase()
  const tags: string[] = []
  const add = (label: string) => { if (!tags.includes(label)) tags.push(label) }
  if (/(fomc|fed|federal reserve)/.test(t)) add('Fed')
  if (/(usd|dxy|fx|dollar)/.test(t)) add('USD')
  if (/(real yield|real yields|treasury|10-year|10 year)/.test(t)) add('Real yields')
  if (/(cpi|inflation|ppi)/.test(t)) add('Inflation')
  if (t.includes('pboc') || /(central bank|reserves)/.test(t)) add('Central banks')
  if (/(gld|etf)/.test(t)) add('GLD/ETF')
  if (/(comex|futures)/.test(t)) add('Futures')
  if (/(geopolitic|war|conflict|middle east)/.test(t)) add('Geopolitics')
  if (/(silver|xag|slv)/.test(t)) add('Silver')
  if (/(platinum|xpt)/.test(t)) add('Platinum')
  if (/(autocatalyst|palladium)/.test(t)) add('Autocatalyst')
  if (/(hydrogen|pem|fuel cell|electrolyser|electrolyzer)/.test(t)) add('Hydrogen')
  if (/(south africa|eskom|power outages)/.test(t)) add('South Africa')
  return tags.slice(0,4)
}

function paragraphs(text?: string){
  const t = (text||'').split(/\n+/).map(s=>s.trim()).filter(Boolean)
  return t
}

function isGoldItem(n: {title:string;desc?:string;full?:string}){ const T = (n.title||'').toLowerCase(); return /(gold|xau|gld)/.test(T) }
function isSilverItem(n: {title:string;desc?:string;full?:string}){ const T = (n.title||'').toLowerCase(); return /(silver|xag|slv)/.test(T) }
function isPlatinumItem(n: {title:string;desc?:string;full?:string}){ const T = (n.title||'').toLowerCase(); return /(platinum|xpt)/.test(T) }

function buildSummary(items: {title:string;desc?:string;full?:string}[], metal: 'gold'|'silver'|'platinum'){
  const text = (s?: string) => (s||'').toLowerCase()
  const titles = items.map(i=>text(i.title))
  const bodies = items.map(i=>text(i.full||i.desc||''))
  const count = (re: RegExp) => titles.filter(t=>re.test(t)).length + bodies.filter(b=>re.test(b)).length
  const bullets: string[] = []
  if (metal === 'gold'){
    if (count(/central bank|reserves|pboc/) > 0) bullets.push('Central bank demand remains a key support.')
    if (count(/etf|gld/) > 0) bullets.push('ETF flows show renewed interest from investors.')
    if (count(/usd|dxy|real yield|treasury/) > 0) bullets.push('USD and US real yields steer short‑term moves.')
    if (count(/geopolitic|war|conflict|middle east/) > 0) bullets.push('Geopolitical uncertainty sustains safe‑haven bids.')
    if (bullets.length === 0) bullets.push('Prices track macro drivers and positioning across ETFs and futures.')
    return { title: 'Gold — Editor’s summary', bullets }
  }
  if (metal === 'silver'){
    if (count(/comex|warehouse|inventory|deliver/) > 0) bullets.push('Warehouse inventory signals and deliveries matter for price.')
    if (count(/etf|slv/) > 0) bullets.push('ETF flows can quickly amplify moves in a smaller market.')
    if (count(/ratio|gold\/silver/) > 0) bullets.push('Gold/silver ratio moves help frame relative value.')
    if (count(/pv|solar|electronics|ev|semiconductor/) > 0) bullets.push('Industrial demand from PV, electronics and EVs remains in focus.')
    if (bullets.length === 0) bullets.push('Momentum reflects a mix of industrial demand and investment flows.')
    return { title: 'Silver — Editor’s summary', bullets }
  }
  if (metal === 'platinum'){
    if (count(/autocatalyst|palladium/) > 0) bullets.push('Autocatalyst demand benefits from palladium substitution.')
    if (count(/south africa|eskom|power/) > 0) bullets.push('South Africa supply constraints keep mine output subdued.')
    if (count(/hydrogen|pem|fuel cell|electrolyser|electrolyzer/) > 0) bullets.push('Hydrogen PEM fuel cells and electrolysers add structural demand.')
    if (bullets.length === 0) bullets.push('Market balance remains sensitive to supply and industrial trends.')
    return { title: 'Platinum — Editor’s summary', bullets }
  }
  return { title: 'Editor’s summary', bullets: ['Market context unavailable.'] }
}

export default async function NewsPage({ searchParams }: { searchParams?: { [key:string]: string | string[] | undefined } }){
  const limitParam = typeof searchParams?.limit === 'string' ? parseInt(searchParams!.limit, 10) : 20
  const limit = Math.min(30, Math.max(5, Number.isFinite(limitParam) ? limitParam : 20))
  const r = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/news?limit=${limit}&full=1`, { cache: 'no-store' })
  const items: {title:string;source:string;published:number;desc?:string;full?:string}[] = await r.json()
  const goldItems = items.filter(isGoldItem).slice(0, 10)
  const silverItems = items.filter(isSilverItem).slice(0, 10)
  const platinumItems = items.filter(isPlatinumItem).slice(0, 10)
  const goldSummary = buildSummary(goldItems, 'gold')
  const silverSummary = buildSummary(silverItems, 'silver')
  const platinumSummary = buildSummary(platinumItems, 'platinum')
  const allTags = items.flatMap(n=>extractTags(n.title))
  const tagCounts: Record<string, number> = {}
  for (const t of allTags) tagCounts[t] = (tagCounts[t]||0) + 1
  const topTags = Object.entries(tagCounts).sort((a,b)=>b[1]-a[1]).slice(0,6)
  const textAll = items.map(i=>((i.title||'')+' '+(i.full||i.desc||''))).join('\n').toLowerCase()
  const countAll = (re: RegExp) => (textAll.match(new RegExp(re.source, 'g'))||[]).length

  return (
    <div className="container py-5">
      <JsonLd type="news" />
      <JsonLd type="breadcrumbs" data={{ items: [ { name:'Home', url: '/' }, { name:'Market Headlines', url: '/news' } ] }} />
      <h1 className="text-center mb-3">Gold Market Headlines</h1>
      <h3 className="text-center text-muted mb-2">Direct updates on bullion and precious metals</h3>
      <div className="text-muted text-center mb-4">Content is shown directly here with cleaned formatting and daily refresh.</div>
      <div className="row g-3 mb-3">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h2 className="h6 mb-2">Trending themes</h2>
              <ul className="mb-2">
                <li>Central bank gold buying remains robust and supports higher structural price levels.</li>
                <li>ETF flows have turned positive, adding investment demand alongside retail bar/coin purchases.</li>
                <li>Real yields and USD moves continue to drive short‑term swings; easing yields or weaker USD typically support gold.</li>
                <li>Geopolitics and trade uncertainty elevate safe‑haven bids; consolidation phases may follow strong rallies.</li>
              </ul>
              <div className="small text-muted">These themes reflect current market commentary across major research desks and industry sources.</div>
            </div>
          </div>
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-12">
          <div className="card">
            <div className="card-body d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div>
                <h2 className="h6 mb-2">Quick filters</h2>
                <div className="d-flex gap-2">
                  <a className="btn btn-outline-secondary btn-sm" href="/news?limit=10">10 items</a>
                  <a className="btn btn-outline-secondary btn-sm" href="/news?limit=20">20 items</a>
                  <a className="btn btn-outline-secondary btn-sm" href="/news?limit=30">30 items</a>
                </div>
              </div>
              <div>
                <h2 className="h6 mb-2">Today’s top tags</h2>
                <div className="d-flex flex-wrap gap-2">
                  {topTags.length === 0 ? (
                    <span className="text-muted small">No tags detected</span>
                  ) : (
                    topTags.map(([tag, cnt]) => (
                      <span key={tag} className="badge bg-secondary">{tag} • {cnt}</span>
                    ))
                  )}
                </div>
              </div>
              <div className="w-100 mt-2">
                <h2 className="h6 mb-2">Theme counters</h2>
                <ul className="mb-0">
                  <li>Central banks: {countAll(/central bank|reserves|pboc/)}</li>
                  <li>ETF/GLD/SLV: {countAll(/etf|gld|slv/)}</li>
                  <li>USD/DXY: {countAll(/usd|dxy|dollar/)}</li>
                  <li>Real yields/Treasury: {countAll(/real yield|treasury|10-year|10 year/)}</li>
                  <li>Inflation/CPI/PPI: {countAll(/inflation|cpi|ppi/)}</li>
                  <li>Geopolitics: {countAll(/geopolitic|war|conflict|middle east/)}</li>
                  <li>COMEX/warehouses: {countAll(/comex|warehouse|inventory|deliver/)}</li>
                  <li>Silver mentions: {countAll(/silver|xag|slv/)}</li>
                  <li>Platinum mentions: {countAll(/platinum|xpt/)}</li>
                  <li>Hydrogen/PEM: {countAll(/hydrogen|pem|fuel cell|electrolyser|electrolyzer/)}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h2 className="h6 mb-2">Macro watchlist</h2>
              <ul className="mb-2">
                <li>Fed policy path and real yields direction; easing real yields often supports gold.</li>
                <li>USD (DXY) trend and FX volatility; dollar weakness typically helps bullion.</li>
                <li>China domestic gold premium vs international price as a demand signal.</li>
                <li>ETF holdings momentum (inflows/outflows) alongside retail bar/coin demand.</li>
              </ul>
              <div className="small text-muted">Use these anchors to frame daily headlines and price moves.</div>
            </div>
          </div>
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h2 className="h6 mb-2">Editor’s Picks</h2>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="h5 mb-2">{goldSummary.title}</div>
                      <ul className="mb-0">
                        {goldSummary.bullets.map((b, i)=> (<li key={i}>{b}</li>))}
                      </ul>
                      <div className="small text-muted mt-2">Updated • {new Date().toLocaleDateString('en-US')}</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="h5 mb-2">{silverSummary.title}</div>
                      <ul className="mb-0">
                        {silverSummary.bullets.map((b, i)=> (<li key={i}>{b}</li>))}
                      </ul>
                      <div className="small text-muted mt-2">Updated • {new Date().toLocaleDateString('en-US')}</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="h5 mb-2">{platinumSummary.title}</div>
                      <ul className="mb-0">
                        {platinumSummary.bullets.map((b, i)=> (<li key={i}>{b}</li>))}
                      </ul>
                      <div className="small text-muted mt-2">Updated • {new Date().toLocaleDateString('en-US')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row g-3">
        {(!items || items.length===0) ? (
          <div className="text-center">No recent gold-related headlines.</div>
        ) : (
          <>
            {items.map((n,i)=> (
              <div className="col-12" key={i}>
                <div className="card h-100">
                  <div className="card-body">
                    <div className="h5 mb-2">{n.title}</div>
                    {extractTags(n.title).length > 0 && (
                      <div className="d-flex flex-wrap gap-1 mb-2">
                        {extractTags(n.title).map((tag, j) => (
                          <span key={j} className="badge bg-secondary">{tag}</span>
                        ))}
                      </div>
                    )}
                    {(n.full || n.desc) && (
                      (() => {
                        const ps = paragraphs(n.full || n.desc)
                        const head = ps.slice(0,3)
                        const tail = ps.slice(3)
                        return (
                          <div className="mt-2">
                            {head.map((p, k)=> (<p key={k} className="mb-2">{p}</p>))}
                            {tail.length > 0 && (
                              <details>
                                <summary className="text-primary" role="button">展开全文</summary>
                                <div className="mt-2">
                                  {tail.map((p, k)=> (<p key={`t-${k}`} className="mb-2">{p}</p>))}
                                </div>
                              </details>
                            )}
                          </div>
                        )
                      })()
                    )}
                    <div className="text-muted small mt-2">{(/google/i.test(n.source||'')) ? 'Publisher' : n.source} • {timeAgo(n.published)}</div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
export const metadata: Metadata = {
  title: 'Gold Market Headlines – What’s moving prices today? | Gold Calculator',
  description: 'Latest updates covering policy, USD strength, real yields and central bank demand.',
  alternates: { canonical: 'https://www.goldcalculator.click/news' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    title: 'Gold Market Headlines – What’s moving prices today?',
    description: 'Track updates impacting gold: Fed, USD, real yields, central banks.',
    url: 'https://www.goldcalculator.click/news',
    siteName: 'Gold Calculator',
    type: 'website'
  },
  twitter: { card: 'summary', title: 'Gold Market Headlines', description: 'What’s moving gold prices today: Fed, USD, yields, central banks.' }
}
