// Vercel Serverless — 婚礼数据存取（用 Vercel KV）
import { kv } from '@vercel/kv'

const KEY = 'wedding-data'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    if (req.method === 'GET') {
      const data = await kv.get(KEY)
      if (!data) return res.status(404).json({ error: 'no data' })
      return res.status(200).json(data)
    }
    if (req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
      await kv.set(KEY, body)
      return res.status(200).json({ ok: true })
    }
    return res.status(405).end()
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
