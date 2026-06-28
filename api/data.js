// Turso SQLite — libsql client
import { createClient } from '@libsql/client/web'

let db = null
function getDB() {
  if (!db) {
    db = createClient({
      url: 'libsql://mywedding-hf2214181104.aws-ap-northeast-1.turso.io',
      authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJleHAiOjE4NDYwMjcxNDcsImlhdCI6MTc4MjYwOTU0NywiaWQiOiIwMTlmMGJjZS00NDAxLTdjZDUtYjJiYS1iYTZkY2YxYjk3ZGQiLCJyaWQiOiI3MTNhN2IyYi0yZjU3LTQyMzktOGE0Ny01YWU4NDhkZDFkNjcifQ.PJFE51Qe2fizi7sVdo4ZwMTIQr54534Kf2uG1S6FIByOqmjeu1PaKI5i_9J6Nke_0pQ_Y3gka-9wsUbiyHIxBw',
    })
    db.execute('CREATE TABLE IF NOT EXISTS store (key TEXT PRIMARY KEY, value TEXT NOT NULL)').catch(() => {})
  }
  return db
}

async function readBody(req) {
  const chunks = []; for await (const c of req) chunks.push(c); return Buffer.concat(chunks).toString()
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    if (req.method === 'GET') {
      const r = await getDB().execute('SELECT value FROM store WHERE key = ?', ['wedding'])
      const row = r.rows[0]
      return row ? res.json(JSON.parse(row.value)) : res.status(404).json({})
    }
    if (req.method === 'PUT') {
      const raw = await readBody(req)
      await getDB().execute('INSERT OR REPLACE INTO store (key, value) VALUES (?, ?)', ['wedding', raw])
      return res.json({ ok: true })
    }
    return res.status(405).end()
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
