// Upstash KV 数据库
import { AppData } from './types'

const API = '/api/data'

export function hasWebDAVPass(): boolean { return true }
export function setWebDAVPass(_p: string) {}

export async function nutUpload(data: AppData): Promise<string | null> {
  try {
    const resp = await fetch(API, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return resp.ok ? 'ok' : null
  } catch { return null }
}

export async function nutDownload(): Promise<{ data: AppData; hash: string; remoteChanged: boolean } | null> {
  try {
    const resp = await fetch(API)
    if (!resp.ok) return null
    const data = await resp.json()
    if (!data?.weddingInfo?.weddingDate) return null
    return { data, hash: JSON.stringify(data), remoteChanged: true }
  } catch { return null }
}

export function nutDownloadToLocal(data: AppData) {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
  a.download = `wedding-${new Date().toISOString().slice(0, 10)}.json`; a.click(); URL.revokeObjectURL(a.href)
}

export async function nutBackup(_d: AppData): Promise<number> { return 0 }
