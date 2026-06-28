import { useState, useCallback, useEffect, useRef } from 'react'
import { AppData } from '../types'
import { seedData } from '../data/seed'
import { nutUpload, nutDownload } from '../nutstore'
import { loadData, saveData } from '../store'

function now() { return new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }

function validate(d: AppData): string[] {
  const e: string[] = []
  if (d.weddingInfo.totalBudget < 0) e.push('总预算不能为负数')
  d.guests.forEach((g, i) => { if (g.estimated <= 0) e.push(`宾客组"${g.name || '第' + (i + 1) + '组'}"预计人数必须>0`) })
  d.budgetCategories.forEach(c => { if (c.budget < 0) e.push(`"${c.name}"预算不能为负`) })
  return e
}

export function useStorage() {
  const [data, setData] = useState<AppData>(() => loadData())
  const [status, setStatus] = useState('在线')
  const [lastSync, setLastSync] = useState('')

  const dataRef = useRef(data); dataRef.current = data
  const editingRef = useRef(false)

  // 启动：从服务器拉取最新
  useEffect(() => {
    nutDownload().then(r => {
      if (r?.data?.weddingInfo?.weddingDate) {
        setData(r.data); saveData(r.data); setLastSync(now()); setStatus('在线')
      } else {
        // 服务器空，推送本地
        nutUpload(dataRef.current).then(ok => {
          if (ok) { setLastSync(now()); setStatus('在线') }
          else { setStatus('离线'); alert('⚠️ 无法连接数据库，请检查网络') }
        })
      }
    }).catch(() => { setStatus('离线'); alert('⚠️ 无法连接数据库，请检查网络后刷新页面') })
  }, [])

  // 数据变更 → 上传
  const skipFirst = useRef(true)
  useEffect(() => {
    if (skipFirst.current) { skipFirst.current = false; return }
    if (editingRef.current) return
    nutUpload(data).then(ok => {
      if (ok) { setLastSync(now()); setStatus('在线') }
      else setStatus('离线')
    })
  }, [data])

  const update = useCallback((newData: AppData) => {
    const errs = validate(newData)
    if (errs.length) { alert('❌ ' + errs.join('\n')); return }
    const d = { ...newData, _ts: Date.now() }
    saveData(d); setData(d)
  }, [])

  const refresh = useCallback(async () => {
    const r = await nutDownload()
    if (r?.data?.weddingInfo?.weddingDate) { setData(r.data); saveData(r.data); setLastSync(now()); setStatus('在线') }
    else setStatus('离线')
  }, [])

  const reset = useCallback(() => setData(JSON.parse(JSON.stringify(seedData))), [])

  const pull = useCallback(async () => {
    const r = await nutDownload()
    if (r?.data) { setData(r.data); saveData(r.data); setLastSync(now()); setStatus('在线') }
  }, [])

  const push = useCallback(async () => {
    const ok = await nutUpload(dataRef.current)
    if (ok) { setLastSync(now()); setStatus('在线') }
    else setStatus('离线')
  }, [])

  return { data, update, reset, pull, push, refresh, status, lastSync, editingRef }
}
