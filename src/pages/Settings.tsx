import { useState, useEffect } from 'react'
import { AppData, WeddingInfo } from '../types'
import { exportXLSX, exportGuestXLSX } from '../store'
import { nutDownloadToLocal } from '../nutstore'

interface Props {
  data: AppData; update: (d: AppData) => void; reset: () => void
  manualSync: () => Promise<string>; manualUpload: () => Promise<string>
  toggleAutoSync: () => void; reconnect: () => void
  autoSync: boolean; syncStatus: string; lastSyncTime: string; syncChange: string
  dirtyCount: number; offlineChanges: boolean
}

export default function Settings({ data, update, reset, manualSync, manualUpload, toggleAutoSync, reconnect, autoSync, syncStatus, lastSyncTime, syncChange, dirtyCount, offlineChanges }: Props) {
  const [info, setInfo] = useState<WeddingInfo>(data.weddingInfo)
  useEffect(() => { setInfo(data.weddingInfo) }, [data.weddingInfo])
  const [importText, setImportText] = useState('')
  const [msg, setMsg] = useState('')

  const save = () => { update({ ...data, weddingInfo: info }); alert('✅ 已保存') }
  const handleImport = () => {
    try {
      const imported = JSON.parse(importText) as AppData
      if (imported.weddingInfo && confirm('导入将覆盖当前数据？')) { update(imported); setImportText(''); alert('✅ 导入成功') }
    } catch { alert('❌ JSON 格式错误') }
  }
  const handleSync = async () => { const m = await manualSync(); setMsg(m) }
  const handleUpload = async () => { const m = await manualUpload(); setMsg(m) }

  const si = syncStatus === '在线' ? '🟢' : syncStatus === '下载中' || syncStatus === '加载中' ? '🟡' : syncStatus === '离线' ? '🟠' : syncStatus === '失败' ? '🔴' : '⚪'
  const st = syncStatus === '在线' ? '已连接' : syncStatus === '下载中' || syncStatus === '加载中' ? '连接中…' : syncStatus === '离线' ? (offlineChanges ? `${dirtyCount} 项待同步` : '已离线') : syncStatus === '失败' ? '连接失败' : '未连接'

  return (
    <div className="p-5 space-y-5 pb-20">
      <h2 className="text-lg font-bold text-ink">⚙️ 设置</h2>

      {/* 同步 */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-softink">🔄 Vercel 云同步</h3>
        <div className={`rounded-2xl p-4 border space-y-3 ${syncStatus === '在线' ? 'bg-sage/10 border-sage/30' : syncStatus === '离线' || syncStatus === '失败' ? 'bg-red-50 border-red-200' : 'bg-warm/50 border-warm'}`}>
          <div className="flex items-center gap-2">
            <span className="text-lg">{si}</span>
            <span className="text-sm font-medium text-softink">{st}</span>
            {lastSyncTime && <span className="text-xs text-softink/70 ml-auto">🕐 {lastSyncTime}</span>}
          </div>
          {syncChange && <p className="text-xs text-softink">{syncChange}</p>}
          {msg && <p className="text-sm text-sage font-medium">{msg}</p>}

          <div className="flex gap-2">
            <button onClick={handleSync} className="flex-1 bg-sage text-white py-2 rounded-xl text-sm font-medium">📥 同步</button>
            <button onClick={handleUpload} className="flex-1 bg-deeprose text-white py-2 rounded-xl text-sm font-medium">📤 上传</button>
          </div>
          <button onClick={toggleAutoSync} className={`w-full py-2 rounded-xl text-sm font-medium ${autoSync ? 'bg-sage/20 text-sage border border-sage/30' : 'bg-warm/70 text-softink border border-warm'}`}>
            {autoSync ? '🔄 自动同步' : '⏸ 手动模式'}
          </button>
        </div>
      </section>

      {/* 基本信息 */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-softink">基本信息</h3>
        <div className="grid grid-cols-2 gap-2">
          <input placeholder="新郎姓名" value={info.groomName} onChange={e => setInfo({ ...info, groomName: e.target.value })} className="bg-warm/70 border-0 rounded-xl px-4 py-2.5 text-sm text-ink" />
          <input placeholder="新娘姓名" value={info.brideName} onChange={e => setInfo({ ...info, brideName: e.target.value })} className="bg-warm/70 border-0 rounded-xl px-4 py-2.5 text-sm text-ink" />
        </div>
        <input type="date" value={info.weddingDate} onChange={e => setInfo({ ...info, weddingDate: e.target.value })} className="w-full bg-warm/70 border-0 rounded-xl px-4 py-2.5 text-sm text-ink" />
        <input type="number" placeholder="总预算（元）" value={info.totalBudget || ''} onChange={e => setInfo({ ...info, totalBudget: +e.target.value })} className="w-full bg-warm/70 border-0 rounded-xl px-4 py-2.5 text-sm text-ink" />
        <button onClick={save} className="w-full bg-ink text-white py-2.5 rounded-xl text-sm font-medium">保存设置</button>
      </section>

      {/* 数据 */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-softink">📦 数据导出</h3>
        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => exportXLSX(data)} className="bg-ink text-white py-2.5 rounded-xl text-sm font-medium">全部 Excel</button>
          <button onClick={() => exportGuestXLSX(data.guests)} className="bg-sage text-white py-2.5 rounded-xl text-sm font-medium">宾客 Excel</button>
          <button onClick={() => nutDownloadToLocal(data)} className="bg-deeprose text-white py-2.5 rounded-xl text-sm font-medium">备份 JSON</button>
        </div>
        <textarea placeholder="粘贴 JSON 以导入…" value={importText} onChange={e => setImportText(e.target.value)} className="w-full bg-warm/70 border-0 rounded-xl p-3 text-sm h-20 text-ink resize-none" />
        <button onClick={handleImport} className="w-full bg-warm text-softink py-2.5 rounded-xl text-sm font-medium">导入数据</button>
      </section>

      <button onClick={() => { if (confirm('⚠️ 清空所有数据？')) { reset(); setInfo({ brideName: '蒋沁伶', groomName: '何飞', weddingDate: '2026-12-26', totalBudget: 60000 }) } }}
        className="w-full bg-red-400/15 text-red-500 py-2.5 rounded-xl text-sm font-medium">🔄 重置全部数据</button>
    </div>
  )
}
