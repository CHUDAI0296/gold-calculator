import { NextResponse } from 'next/server'

export const runtime = 'edge'

type NewsItem = { title: string; link: string; published: number; source: string, desc?: string }

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
    const desc = (textBetween(blk, 'description') || textBetween(blk, 'content:encoded') || '').replace(/<[^>]+>/g, '').trim()
    const pub = (textBetween(blk, 'pubDate') || textBetween(blk, 'published') || textBetween(blk, 'updated') || '').trim()
    const ts = pub ? Date.parse(pub) : Date.now()
    if (title && link) items.push({ title, link, published: isNaN(ts) ? Date.now() : ts, source, desc })
  }
  // Atom <entry>
  const entryBlocks = xml.match(/<entry[\s\S]*?<\/entry>/gi) || []
  for (const blk of entryBlocks) {
    const title = (textBetween(blk, 'title') || '').replace(/<[^>]+>/g, '').trim()
    const link = (attrValue(blk, 'link', 'href') || textBetween(blk, 'link') || '').trim()
    const desc = (textBetween(blk, 'summary') || textBetween(blk, 'content') || '').replace(/<[^>]+>/g, '').trim()
    const pub = (textBetween(blk, 'updated') || textBetween(blk, 'published') || '').trim()
    const ts = pub ? Date.parse(pub) : Date.now()
    if (title && link) items.push({ title, link, published: isNaN(ts) ? Date.now() : ts, source, desc })
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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const q = (searchParams.get('q') || '').trim().toLowerCase()
    const limit = Math.min(20, Math.max(5, parseInt(searchParams.get('limit') || '12', 10)))
    const feeds = [
      { url: 'https://feeds.reuters.com/reuters/commoditiesNews', source: 'Reuters' },
      { url: 'https://www.kitco.com/rss/kitco_news.rss', source: 'Kitco' },
      { url: 'https://finance.yahoo.com/news/rssindex', source: 'Yahoo Finance' },
      { url: 'https://news.google.com/rss/search?q=gold&hl=en-US&gl=US&ceid=US:en', source: 'Google News' },
      { url: 'https://news.google.com/rss/search?q=gold%20price&hl=en-US&gl=US&ceid=US:en', source: 'Google News' },
      { url: 'https://news.google.com/rss/search?q=%E9%BB%84%E9%87%91&hl=zh-CN&gl=CN&ceid=CN:zh-Hans', source: 'Google 新闻' }
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
    let items = results
    if (q) {
      const kws = q.split(/[,|\s]+/).filter(Boolean)
      items = items.filter(it => kws.some(k => it.title.toLowerCase().includes(k) || (it.desc||'').toLowerCase().includes(k)))
    }
    const dedup = items
      .filter(it => { const key = it.link.split('?')[0]; if (seen.has(key)) return false; seen.add(key); return true })
      .sort((a,b)=> b.published - a.published)
      .slice(0, limit)
    return NextResponse.json(dedup)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}