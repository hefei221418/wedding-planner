import { useState, useEffect } from 'react'
import { AppData, WeddingInfo } from '../types'
import { exportXLSX, exportGuestXLSX } from '../store'
import { nutDownloadToLocal } from '../nutstore'

function DateEdit({ date, onSave }: { date: string; onSave: (d: string) => void }) {
  const [open, setOpen] = useState(false)
  const [val, setVal] = useState(date)
  return (
    <>
      <button onClick={() => { setVal(date); setOpen(true) }}
        className="text-xs text-deepmauve hover:underline">✎ 修改</button>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center" onClick={() => setOpen(false)}>
          <div className="bg-elev rounded-t-3xl sm:rounded-3xl p-5 w-full max-w-sm space-y-4 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-ink">修改日期</h3>
            <input type="date" value={val} onChange={e => setVal(e.target.value)}
              className="w-full bg-border border-0 rounded-xl px-4 py-3 text-lg text-ink" />
            <div className="flex gap-2">
              <button onClick={() => setOpen(false)} className="flex-1 bg-surf text-soft py-2.5 rounded-xl text-sm font-medium">取消</button>
              <button onClick={() => { onSave(val); setOpen(false) }}
                className="flex-1 bg-ink text-bg py-2.5 rounded-xl text-sm font-medium">确认</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

interface Props {
  data: AppData; update: (d: AppData) => void; reset: () => void
  status: string; lastSync: string
  editingRef: { current: boolean }
}

export default function Settings({ data, update, reset, status, lastSync, editingRef }: Props) {
  const [info, setInfo] = useState<WeddingInfo>(data.weddingInfo)
  useEffect(() => { setInfo(data.weddingInfo) }, [data.weddingInfo])
  const [importText, setImportText] = useState('')
  const [showImport, setShowImport] = useState(false)
  const [msg, setMsg] = useState('')
  const [saved, setSaved] = useState(false)

  const save = () => { editingRef.current = false; update({ ...data, weddingInfo: info }); setSaved(true); setTimeout(() => setSaved(false), 2000) }
  const handleImport = () => {
    try {
      const imported = JSON.parse(importText) as AppData
      if (imported.weddingInfo && confirm('导入将覆盖当前数据？')) { update(imported); setImportText(''); setShowImport(false); setMsg('✅ 导入成功'); setTimeout(() => setMsg(''), 3000) }
    } catch { setMsg('❌ JSON 格式错误'); setTimeout(() => setMsg(''), 3000) }
  }

  return (
    <div className="p-5 space-y-5 pb-20">
      <h2 className="text-lg font-bold text-ink">⚙️ 设置</h2>

      <section className="space-y-3">
        <div className={`rounded-2xl p-4 border flex items-center justify-between ${status === '在线' ? 'bg-sage/10 border-sage/30' : 'bg-red/10 border-red/30'}`}>
          <div className="flex items-center gap-2"><span className="text-lg">{status === '在线' ? '🟢' : '🔴'}</span><span className="text-sm font-medium text-soft">{status === '在线' ? '数据已同步' : '离线'}</span></div>
          {lastSync && <div className="text-xs text-mute">🕐 {lastSync}</div>}
        </div>
        {msg && <p className="text-sm text-sage font-medium text-center mt-2">{msg}</p>}
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-soft">基本信息</h3>
        <div className="grid grid-cols-2 gap-3">
          <label className="space-y-1"><span className="text-xs text-mute">新郎</span><input placeholder="姓名" value={info.groomName} onChange={e => setInfo({ ...info, groomName: e.target.value })} onFocus={() => editingRef.current = true} onBlur={() => editingRef.current = false} className="w-full bg-border border-0 rounded-xl px-4 py-2.5 text-sm text-ink" /></label>
          <label className="space-y-1"><span className="text-xs text-mute">新娘</span><input placeholder="姓名" value={info.brideName} onChange={e => setInfo({ ...info, brideName: e.target.value })} onFocus={() => editingRef.current = true} onBlur={() => editingRef.current = false} className="w-full bg-border border-0 rounded-xl px-4 py-2.5 text-sm text-ink" /></label>
        </div>
        <label className="space-y-1 block"><span className="text-xs text-mute">婚期</span><input type="date" value={info.weddingDate} onChange={e => setInfo({ ...info, weddingDate: e.target.value })} onFocus={() => editingRef.current = true} onBlur={() => editingRef.current = false} className="w-full bg-border border-0 rounded-xl px-4 py-2.5 text-sm text-ink" /></label>
        <label className="space-y-1 block"><span className="text-xs text-mute">总预算</span><input type="number" placeholder="元" value={info.totalBudget || ''} onChange={e => setInfo({ ...info, totalBudget: +e.target.value })} onFocus={() => editingRef.current = true} onBlur={() => editingRef.current = false} className="w-full bg-border border-0 rounded-xl px-4 py-2.5 text-sm text-ink" /></label>
        <button onClick={save} className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${saved ? 'bg-sage text-white' : 'bg-ink text-bg hover:bg-soft'}`}>{saved ? '✅ 已保存' : '保存设置'}</button>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-soft">📅 关键日期</h3>
        {(data.milestones || []).map((m, i) => {
          const diff = m.date ? Math.ceil((new Date(m.date).getTime() - Date.now()) / 86400000) : 0
          const cdText = !m.date ? '' : diff < 0 ? '✅ 已过' : diff === 0 ? '就是今天！' : `倒计时 ${diff} 天`
          const cdColor = diff < 0 ? 'text-sage' : diff <= 14 ? 'text-red' : 'text-soft'
          return (
            <div key={m.id} className="bg-surf rounded-2xl px-4 py-3 space-y-2 border border-border">
              <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="text-lg">{m.icon}</span><span className="text-sm font-medium text-soft">{m.name}</span></div><span className={`text-xs font-semibold ${cdColor}`}>{cdText}</span></div>
              <DateEdit date={m.date} onSave={d => { const u = data.milestones.map((x, j) => j === i ? { ...x, date: d } : x); update({ ...data, milestones: u }) }} />
              {m.date && <p className="text-xs text-mute">阳历 {new Date(m.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}</p>}
            </div>
          )
        })}
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-soft">📦 数据</h3>
        <div className="flex gap-2">
          <button onClick={() => exportXLSX(data)} className="flex-1 bg-ink text-bg py-2.5 rounded-xl text-sm font-medium">导出 Excel</button>
          <button onClick={() => exportGuestXLSX(data.guests)} className="flex-1 bg-sage text-white py-2.5 rounded-xl text-sm font-medium">导出宾客表</button>
          <button onClick={() => nutDownloadToLocal(data)} className="flex-1 bg-surf text-soft py-2.5 rounded-xl text-sm font-medium">备份 JSON</button>
        </div>
        <button onClick={() => setShowImport(!showImport)} className="w-full text-mute text-xs hover:text-soft">{showImport ? '收起' : '更多设置...'}</button>
        {showImport && (
          <div className="space-y-2">
            <textarea placeholder="粘贴 JSON 导入数据..." value={importText} onChange={e => setImportText(e.target.value)} className="w-full bg-border border-0 rounded-xl p-3 text-sm h-24 text-ink resize-none" />
            <div className="flex gap-2">
              <button onClick={handleImport} className="flex-1 bg-surf text-soft py-2 rounded-xl text-sm font-medium">确认导入</button>
              <button onClick={() => { if (confirm('⚠️ 清空所有数据？')) { reset(); setInfo({ brideName: '蒋沁伶', groomName: '何飞', weddingDate: '2026-12-26', totalBudget: 60000 }) } }} className="bg-red/15 text-red py-2 px-3 rounded-xl text-sm font-medium">🔄 重置</button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
