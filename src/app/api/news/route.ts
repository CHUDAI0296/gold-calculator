import { NextResponse } from 'next/server'

export const runtime = 'edge'

type NewsItem = { title: string; link: string; published: number; source: string }

function textBetween(xml: string, tag: string): string | null {
  const m = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i').exec(xml)
  return m ? m[1].trim() : null
}

function attrValue(xml: string, tag: string, attr: string): string | null {
  const m = new RegExp(`<${tag}[^>]*${attr}=["']([^"']+)["'][^>]*>`, 'i').exec(xml)
  return m ? m[1] : null
}

function parseRss(xml: string, source: string): NewsItem[] {
  const items: NewsItem[] = []
  const itemBlocks = xml.match(/<item[\s\S]*?<\/item>/gi) || []
  for (const blk of itemBlocks) {
    const title = (textBetween(blk, 'title') || '').replace(/<[^>]+>/g, '').trim()
    const link = (textBetween(blk, 'link') || attrValue(blk, 'link', 'href') || '').trim()
    const pub = (textBetween(blk, 'pubDate') || textBetween(blk, 'published') || textBetween(blk, 'updated') || '').trim()
    const ts = pub ? Date.parse(pub) : Date.now()
    if (title && link) items.push({ title, link, published: isNaN(ts) ? Date.now() : ts, source })
  }
  // Atom <entry>
  const entryBlocks = xml.match(/<entry[\s\S]*?<\/entry>/gi) || []
  for (const blk of entryBlocks) {
    const title = (textBetween(blk, 'title') || '').replace(/<[^>]+>/g, '').trim()
    const link = (attrValue(blk, 'link', 'href') || textBetween(blk, 'link') || '').trim()
    const pub = (textBetween(blk, 'updated') || textBetween(blk, 'published') || '').trim()
    const ts = pub ? Date.parse(pub) : Date.now()
    if (title && link) items.push({ title, link, published: isNaN(ts) ? Date.now() : ts, source })
  }
  return items
}

async function fetchWithTimeout(url: string, ms = 4000): Promise<string> {
  const ctrl = new AbortController()
  const id = setTimeout(() => ctrl.abort(), ms)
  try {
    const r = await fetch(url, { signal: ctrl.signal, headers: { 'Accept': 'application/rss+xml, application/atom+xml, text/xml, text/plain' }, cache: 'no-store' })
    if (!r.ok) throw new Error('bad')
    return await r.text()
  } finally { clearTimeout(id) }
}

export async function GET() {
  try {
    const feeds = [
      { url: 'https://feeds.reuters.com/reuters/commoditiesNews', source: 'Reuters' },
      { url: 'https://www.kitco.com/rss/kitco_news.rss', source: 'Kitco' },
      { url: 'https://finance.yahoo.com/news/rssindex', source: 'Yahoo Finance' }
    ]
    const results: NewsItem[] = []
    await Promise.all(feeds.map(async f => {
      try {
        const xml = await fetchWithTimeout(f.url)
        results.push(...parseRss(xml, f.source))
      } catch {}
    }))
    // 去重与排序
    const seen = new Set<string>()
    const dedup = results
      .filter(it => { const key = it.link.split('?')[0]; if (seen.has(key)) return false; seen.add(key); return true })
      .sort((a,b)=> b.published - a.published)
      .slice(0, 12)
    return NextResponse.json(dedup)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}