import { NextRequest } from 'next/server'
import Replicate from 'replicate'

export const runtime = 'nodejs'

export async function POST(req: NextRequest){
  try{
    const body = await req.json().catch(()=>({})) as { prompt?: string; max_tokens?: number }
    const prompt = (body?.prompt ?? '').toString()
    const maxTokens = Number(body?.max_tokens ?? 4096)
    if (!prompt) return new Response('Missing prompt', { status: 400 })
    const token = process.env.REPLICATE_API_TOKEN
    if (!token) return new Response('Server not configured', { status: 500 })

    const replicate = new Replicate({ auth: token })
    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller){
        try{
          const input = { prompt, max_tokens: maxTokens }
          for await (const event of replicate.stream('deepseek-ai/deepseek-r1', { input })){
            controller.enqueue(encoder.encode(String(event)))
          }
          controller.close()
        }catch(err:any){
          controller.enqueue(encoder.encode(`[error] ${err?.message || 'failed'}`))
          controller.close()
        }
      }
    })

    return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
  }catch{
    return new Response('Bad request', { status: 400 })
  }
}