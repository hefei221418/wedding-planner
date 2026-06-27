import { useState, useCallback, useEffect, useRef } from 'react'
import { AppData } from '../types'
import { seedData } from '../data/seed'
import { nutUpload, nutDownload, nutBackup, hasWebDAVPass } from '../nutstore'
import { loadData, saveData } from '../store'

// --- 模块级状态 ---
let gPollId: number | null = null
let gAutoSync = true
let gSyncing = false
let gDirty = false
let gRetryTimer: number | null = null
let gVersion = 0
let gLastSynced: string = ''   // ✅ 上次同步数据的快照，防上传循环

function now() { return new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }

function validate(d: AppData): string[] {
  const e: string[] = []
  if (d.weddingInfo.totalBudget < 0) e.push('总预算不能为负数')
  d.guests.forEach((g, i) => { if (g.estimated <= 0) e.push(`宾客组"${g.name || '第' + (i + 1) + '组'}"预计人数必须>0`) })
  d.budgetCategories.forEach(c => { if (c.budget < 0) e.push(`"${c.name}"预算不能为负`) })
  return e
}

function diff(prev: AppData, next: AppData): string {
  const c: string[] = []
  if (next.todos.length !== prev.todos.length) c.push(`待办${prev.todos.length}→${next.todos.length}`)
  if (next.guests.length !== prev.guests.length) c.push(`宾客${prev.guests.length}→${next.guests.length}`)
  if (next.cars.length !== prev.cars.length) c.push(`婚车${prev.cars.length}→${next.cars.length}`)
  const ps = prev.expenses.reduce((a, b) => a + b.amount, 0)
  const ns = next.expenses.reduce((a, b) => a + b.amount, 0)
  if (ps !== ns) c.push('预算变动')
  if (prev.weddingInfo.weddingDate !== next.weddingInfo.weddingDate) c.push('婚期变更')
  return c.length ? c.join('、') : '无变化'
}

function isEqual(a: AppData, b: AppData): boolean {
  try { return JSON.stringify(a) === JSON.stringify(b) } catch { return false }
}

function merge(remote: AppData, local: AppData): AppData {
  const rTodoIds = new Set(remote.todos.map(t => t.id))
  const rGuestIds = new Set(remote.guests.map(g => g.id))
  const rExpIds = new Set(remote.expenses.map(e => e.id))
  const rCarIds = new Set(remote.cars.map(c => c.id))
  return {
    ...remote,
    todos: [...remote.todos, ...local.todos.filter(t => !rTodoIds.has(t.id))],
    guests: [...remote.guests, ...local.guests.filter(g => !rGuestIds.has(g.id))],
    expenses: [...remote.expenses, ...local.expenses.filter(e => !rExpIds.has(e.id))],
    cars: [...remote.cars, ...local.cars.filter(c => !rCarIds.has(c.id))],
    budgetCategories: remote.budgetCategories.map(rc => {
      const lc = local.budgetCategories.find(c => c.key === rc.key)
      return lc ? { ...rc, budget: Math.max(rc.budget, lc.budget) } : rc
    }),
  }
}

// --- Hook ---
export function useStorage() {
  const [data, setData] = useState<AppData>(() => { const d = loadData(); gVersion = d.version || 0; return d })
  const [syncStatus, setSyncStatus] = useState<'加载中' | '未连接' | '下载中' | '在线' | '离线' | '失败' | '无密码'>('加载中')
  const [autoSync, setAutoSync] = useState(gAutoSync)
  const [lastSyncTime, setLastSyncTime] = useState('')
  const [syncChange, setSyncChange] = useState('')
  const [dirtyCount, setDirtyCount] = useState(0)
  const [offlineChanges, setOfflineChanges] = useState(false)

  const dataRef = useRef(data); dataRef.current = data

  // ====== 启动：有密码 → 下拉 + 开轮询 ======
  useEffect(() => {
    if (!hasWebDAVPass()) { setSyncStatus('无密码'); return }
    pullFromRemote()
    startPolling()
    return () => { stopPolling(); stopRetry() }
  }, [])

  // ====== 数据变更 → 自动上传 ======
  const skipFirst = useRef(true)
  useEffect(() => {
    if (skipFirst.current) { skipFirst.current = false; return }
    // ✅ 数据跟上次同步的一样 → 跳过上传（防远程下载后的循环）\n    const s = JSON.stringify(data)
    if (s === gLastSynced) return
    if (!gAutoSync || !hasWebDAVPass() || gSyncing) return
    gDirty = true
    pushToRemote(data)
  }, [data])

  // ====== 上传 ======
  async function pushToRemote(d: AppData) {
    gSyncing = true
    const ok = await nutUpload(d)
    gSyncing = false
    if (ok) {
      gDirty = false
      gLastSynced = JSON.stringify(d)
      stopRetry()
      setDirtyCount(0); setOfflineChanges(false)
      setLastSyncTime(now()); setSyncChange('↑ 上传'); setSyncStatus('在线')
      nutBackup(d)
    } else {
      setSyncStatus('离线'); setOfflineChanges(true)
      setDirtyCount(c => c + 1)
      startRetry(d)
    }
  }

  // ====== 下拉 ======
  async function pullFromRemote(): Promise<string> {
    if (!hasWebDAVPass()) { setSyncStatus('无密码'); return '请设置密码' }
    setSyncStatus('下载中')
    gSyncing = true
    try {
      const result = await nutDownload()
      gSyncing = false
      if (!result || !result.remoteChanged) {
        // 远程无数据 → 推送本地
        if (!result || !result.data) { gDirty = true; await pushToRemote(dataRef.current) }
        else setSyncStatus('在线')
        return '已同步'
      }
      const { data: r } = result
      if (!r?.weddingInfo?.weddingDate) { setSyncStatus('在线'); return '远程无有效数据' }
      if (isEqual(r, dataRef.current)) { setSyncStatus('在线'); return '已是最新' }

      if (gDirty) {
        const merged = merge(r, dataRef.current)
        gLastSynced = JSON.stringify(merged)  // ✅ 记录同步快照
        setSyncChange('↓ 远程更新（已合并）')
        setLastSyncTime(now()); setData(merged); saveData(merged)
        gDirty = true
        await pushToRemote(merged)
      } else {
        gLastSynced = JSON.stringify(r)  // ✅ 记录同步快照
        setSyncChange('↓ 同步完成')
        setLastSyncTime(now()); setData(r); saveData(r)
      }
      setSyncStatus('在线')
      return '同步完成'
    } catch {
      gSyncing = false
      setSyncStatus('离线')
      return '连接失败'
    }
  }

  // ====== 轮询 ======
  function startPolling() {
    if (gPollId) clearInterval(gPollId)
    gPollId = window.setInterval(async () => {
      if (!gAutoSync || !hasWebDAVPass() || gSyncing) return
      try {
        const result = await nutDownload()
        if (!result || !result.remoteChanged) return
        const { data: r } = result
        if (!r?.weddingInfo?.weddingDate) return
        if (isEqual(r, dataRef.current)) return

        if (gDirty) {
          const merged = merge(r, dataRef.current)
          gLastSynced = JSON.stringify(merged)
          setSyncChange('↓ 远程更新（已合并）')
          setLastSyncTime(now()); setData(merged); saveData(merged)
          gDirty = true
          await pushToRemote(merged)
        } else {
          gLastSynced = JSON.stringify(r)
          const ch = diff(dataRef.current, r)
          setSyncChange('↓ ' + ch)
          setLastSyncTime(now()); setData(r); saveData(r)
        }
      } catch { }
    }, 8000)
  }

  function stopPolling() { if (gPollId) { clearInterval(gPollId); gPollId = null } }

  // ====== 离线重试 ======
  function startRetry(d: AppData) {
    if (gRetryTimer) return
    gRetryTimer = window.setInterval(async () => {
      if (!gDirty) { stopRetry(); return }
      const ok = await nutUpload(d)
      if (ok) {
        gDirty = false; stopRetry()
        setDirtyCount(0); setOfflineChanges(false)
        setLastSyncTime(now()); setSyncChange('↑ 重试上传成功'); setSyncStatus('在线')
        nutBackup(d)
      }
    }, 15000)  // 每 15 秒重试
  }

  function stopRetry() { if (gRetryTimer) { clearInterval(gRetryTimer); gRetryTimer = null } }

  // ====== 公开 API ======
  const update = useCallback((newData: AppData) => {
    const errs = validate(newData)
    if (errs.length) { alert('❌ ' + errs.join('\n')); return }
    gVersion++
    const d = { ...newData, version: gVersion }
    saveData(d); setData(d)
  }, [])

  const reset = useCallback(() => { setData(JSON.parse(JSON.stringify(seedData))) }, [])

  const reconnect = useCallback(() => {
    if (!hasWebDAVPass()) return
    pullFromRemote()
    startPolling()  // ✅ 输入密码后启动轮询
  }, [])

  const toggleAutoSync = useCallback(() => {
    gAutoSync = !gAutoSync; setAutoSync(gAutoSync)
  }, [])

  const manualUpload = useCallback(async (): Promise<string> => {
    if (!hasWebDAVPass()) return '❌ 请先设置密码'
    gDirty = true
    await pushToRemote(dataRef.current)
    return gDirty ? '❌ 上传失败' : '✅ 已上传'
  }, [])

  return {
    data, update, reset,
    manualSync: pullFromRemote,   // 下拉 + 合并上传
    manualUpload,                  // 只上传不拉
    toggleAutoSync, reconnect,
    autoSync, syncStatus, lastSyncTime, syncChange,
    dirtyCount, offlineChanges,
  }
}
