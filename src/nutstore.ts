// 坚果云 WebDAV — 国内直连，无 CORS 问题
import { AppData } from './types'
import { hashStr } from './store'

const DAV = 'https://dav.jianguoyun.com/dav/'
const USER = '2214181104@qq.com'
const PASS = 'aktnrk8dcptkseyc'
const FILE = 'wedding-data.json'

function auth() { return 'Basic ' + btoa(USER + ':' + PASS) }

function encode(d: AppData): string {
  return btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(d))))
}
function decode(t: string): AppData | null {
  try {
    const b = Uint8Array.from(atob(t), c => c.charCodeAt(0))
    return JSON.parse(new TextDecoder().decode(b))
  } catch { return null }
}

export function hasWebDAVPass(): boolean { return true }
export function setWebDAVPass(_p: string) {}

export async function nutUpload(data: AppData): Promise<string | null> {
  try {
    const resp = await fetch(DAV + FILE, {
      method: 'PUT',
      headers: { 'Authorization': auth(), 'Content-Type': 'application/octet-stream' },
      body: new Blob([encode(data)]),
    })
    return (resp.ok || resp.status === 201) ? 'ok' : null
  } catch { return null }
}

export async function nutDownload(): Promise<{ data: AppData; hash: string; remoteChanged: boolean } | null> {
  try {
    const resp = await fetch(DAV + FILE, { headers: { 'Authorization': auth() } })
    if (!resp.ok) return null
    const text = await resp.text()
    const data = decode(text)
    if (!data?.weddingInfo?.weddingDate) return null
    return { data, hash: hashStr(text), remoteChanged: true }
  } catch { return null }
}

export function nutDownloadToLocal(data: AppData) {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
  a.download = `wedding-${new Date().toISOString().slice(0, 10)}.json`; a.click(); URL.revokeObjectURL(a.href)
}

export async function nutBackup(_d: AppData): Promise<number> { return 0 }
