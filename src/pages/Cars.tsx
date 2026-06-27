import { useState } from 'react'
import { AppData, Car } from '../types'
import { uid } from '../store'

interface Props { data: AppData; update: (d: AppData) => void }

export default function Cars({ data, update }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Car>({ id: '', type: '跟车', plate: '', driver: '', driverPhone: '', passengers: '', from: '', to: '' })
  const [editing, setEditing] = useState<string | null>(null)

  const save = () => {
    if (!form.plate && !form.driver) return
    if (editing) update({ ...data, cars: data.cars.map(c => c.id === editing ? form : c) })
    else update({ ...data, cars: [...data.cars, { ...form, id: uid() }] })
    setForm({ id: '', type: '跟车', plate: '', driver: '', driverPhone: '', passengers: '', from: '', to: '' })
    setEditing(null); setShowForm(false)
  }
  const edit = (c: Car) => { setForm({ ...c }); setEditing(c.id); setShowForm(true) }
  const remove = (id: string) => { if (confirm('删除这辆车？')) update({ ...data, cars: data.cars.filter(c => c.id !== id) }) }

  return (
    <div className="p-5 space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-ink">🚗 婚车管理</h2>
        <button onClick={() => { setForm({ id: '', type: '跟车', plate: '', driver: '', driverPhone: '', passengers: '', from: '', to: '' }); setEditing(null); setShowForm(true) }}
          className="bg-ink text-white px-4 py-1.5 rounded-full text-sm font-medium">＋ 添加</button>
      </div>

      {data.cars.length === 0 && !showForm && (
        <div className="text-center text-softink/60 text-sm py-16 space-y-2">
          <p className="text-4xl">🚗</p><p>还没有婚车</p><p className="text-xs">点击右上角 ＋ 添加</p>
        </div>
      )}

      <ul className="space-y-2">
        {data.cars.map(c => (
          <li key={c.id} className={`rounded-2xl p-4 border ${c.type === '主婚车' ? 'bg-rose/10 border-rose/30' : 'bg-white/70 border-warm'}`}>
            <div className="flex justify-between items-start mb-2">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.type === '主婚车' ? 'bg-deeprose/20 text-deeprose' : 'bg-warm/70 text-softink'}`}>{c.type}</span>
              <div className="flex gap-1">
                <button onClick={() => edit(c)} className="text-softink/50 hover:text-ink text-sm px-1">✎</button>
                <button onClick={() => remove(c.id)} className="text-softink/50 hover:text-red-500 text-sm px-1">✕</button>
              </div>
            </div>
            <div className="text-sm space-y-0.5 text-softink">
              {c.plate && <p>🚘 {c.plate}</p>}
              {c.driver && <p>👤 {c.driver} · {c.driverPhone}</p>}
              {c.passengers && <p>👥 {c.passengers}</p>}
              {c.from && <p>📍 {c.from} → {c.to}</p>}
            </div>
          </li>
        ))}
      </ul>

      {showForm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-end sm:items-center justify-center" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-5 w-full max-w-lg space-y-3 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-ink">{editing ? '编辑婚车' : '添加婚车'}</h3>

            <div className="flex gap-2">
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as '主婚车' | '跟车' })}
                className="bg-warm/70 border-0 rounded-xl px-3 py-2.5 text-sm text-softink">
                <option value="主婚车">主婚车</option><option value="跟车">跟车</option>
              </select>
              <input placeholder="车牌号" value={form.plate} onChange={e => setForm({ ...form, plate: e.target.value })}
                className="flex-1 bg-warm/70 border-0 rounded-xl px-3 py-2.5 text-sm text-ink" />
            </div>

            <div className="flex gap-2">
              <input placeholder="司机" value={form.driver} onChange={e => setForm({ ...form, driver: e.target.value })}
                className="flex-1 bg-warm/70 border-0 rounded-xl px-3 py-2.5 text-sm text-ink" />
              <input placeholder="司机电话" value={form.driverPhone} onChange={e => setForm({ ...form, driverPhone: e.target.value })}
                className="flex-1 bg-warm/70 border-0 rounded-xl px-3 py-2.5 text-sm text-ink" />
            </div>

            <input placeholder="乘客（如伴郎伴娘）" value={form.passengers} onChange={e => setForm({ ...form, passengers: e.target.value })}
              className="w-full bg-warm/70 border-0 rounded-xl px-3 py-2.5 text-sm text-ink" />

            <div className="flex gap-2">
              <input placeholder="出发地" value={form.from} onChange={e => setForm({ ...form, from: e.target.value })}
                className="flex-1 bg-warm/70 border-0 rounded-xl px-3 py-2.5 text-sm text-ink" />
              <input placeholder="目的地" value={form.to} onChange={e => setForm({ ...form, to: e.target.value })}
                className="flex-1 bg-warm/70 border-0 rounded-xl px-3 py-2.5 text-sm text-ink" />
            </div>

            <div className="flex gap-2">
              <button onClick={() => setShowForm(false)} className="flex-1 bg-warm/70 text-softink py-2.5 rounded-xl text-sm font-medium">取消</button>
              <button onClick={save} className="flex-1 bg-ink text-white py-2.5 rounded-xl text-sm font-medium">{editing ? '保存' : '添加'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
