// Vercel Serverless — WebDAV CORS Proxy to TeraCloud
export const config = { api: { bodyParser: false } }

const TARGET = 'https://dav.jianguoyun.com/dav'

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PROPFIND,MKCOL,HEAD')
  res.setHeader('Access-Control-Allow-Headers', '*')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const path = (req.url || '').replace(/\/api\/dav\/?/, '')
  const url = TARGET + (path ? '/' + path : '')

  // ✅ 获取原始请求体
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const body = Buffer.concat(chunks)

  // ✅ 转发 headers（跳过 host 相关）
  const fwd = {}
  for (const [k, v] of Object.entries(req.headers)) {
    if (['host', 'x-forwarded-host', 'x-forwarded-proto', 'x-forwarded-for', 'x-vercel-id', 'x-vercel-ip'].includes(k)) continue
    fwd[k] = v
  }

  try {
    const opts = { method: req.method, headers: fwd }
    if (body.length > 0) opts.body = body

    const r = await fetch(url, opts)
    const respText = await r.text()

    res.status(r.status)
    const etag = r.headers.get('etag')
    if (etag) res.setHeader('ETag', etag)
    res.setHeader('Content-Type', r.headers.get('content-type') || 'text/plain')
    res.send(respText)
  } catch (e) {
    res.status(502).send(e.message)
  }
}
