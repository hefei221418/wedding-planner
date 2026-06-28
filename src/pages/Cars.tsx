import { useState } from 'react'
import { AppData, Car } from '../types'
import { uid } from '../store'
import Menu from '../components/Menu'

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
      <h2 className="text-lg font-bold text-ink">🚗 婚车管理</h2>

      {/* ✅ 浮动添加按钮 */}
      <button onClick={() => { setForm({ id: '', type: '跟车', plate: '', driver: '', driverPhone: '', passengers: '', from: '', to: '' }); setEditing(null); setShowForm(true) }}
        className="fixed bottom-24 right-4 lg:right-8 z-40 bg-amber text-white w-14 h-14 rounded-full shadow-lg text-2xl font-light hover:opacity-90 transition-all active:scale-95 flex items-center justify-center">
        ＋
      </button>

      {data.cars.length === 0 && !showForm && (
        <div className="text-center py-16">
          <p className="text-5xl mb-3 opacity-40">🚗</p><p className="text-mute">点击 ＋ 添加婚车</p>
        </div>
      )}

      <ul className="space-y-1.5">
        {data.cars.map(c => (
          <li className={`rounded-xl px-3 py-2 border text-sm ${c.type === '主婚车' ? 'bg-mauve/5 border-mauve/20' : 'bg-surf border-border'}`}>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.type === '主婚车' ? 'bg-deepmauve/20 text-deepmauve' : 'bg-border text-soft'}`}>{c.type}</span>
              <Menu items={[{ label: '编辑', onClick: () => edit(c) }, { label: '删除', onClick: () => remove(c.id), danger: true }]} />
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-xs text-soft">
              {c.plate && <span>🚘 {c.plate}</span>}
              {c.driver && <span>👤 {c.driver}</span>}
              {c.driverPhone && <span>📞 {c.driverPhone}</span>}
              {c.passengers && <span>👥 {c.passengers}</span>}
              {c.from && <span>📍 {c.from} → {c.to}</span>}
            </div>
          </li>
          
        ))}
      </ul>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center" onClick={() => setShowForm(false)}>
          <div className="bg-elev rounded-t-3xl sm:rounded-3xl p-5 w-full max-w-lg space-y-3 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-ink">{editing ? '编辑婚车' : '添加婚车'}</h3>

            <div className="flex gap-2">
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as '主婚车' | '跟车' })}
                className="bg-border border-0 rounded-xl px-3 py-2.5 text-sm text-soft">
                <option value="主婚车">主婚车</option><option value="跟车">跟车</option>
              </select>
              <input placeholder="车牌号" value={form.plate} onChange={e => setForm({ ...form, plate: e.target.value })}
                className="flex-1 bg-border border-0 rounded-xl px-3 py-2.5 text-sm text-ink" />
            </div>

            <div className="flex gap-2">
              <input placeholder="司机" value={form.driver} onChange={e => setForm({ ...form, driver: e.target.value })}
                className="flex-1 bg-border border-0 rounded-xl px-3 py-2.5 text-sm text-ink" />
              <input placeholder="司机电话" value={form.driverPhone} onChange={e => setForm({ ...form, driverPhone: e.target.value })}
                className="flex-1 bg-border border-0 rounded-xl px-3 py-2.5 text-sm text-ink" />
            </div>

            <input placeholder="乘客（如伴郎伴娘）" value={form.passengers} onChange={e => setForm({ ...form, passengers: e.target.value })}
              className="w-full bg-border border-0 rounded-xl px-3 py-2.5 text-sm text-ink" />

            <div className="flex gap-2">
              <input placeholder="出发地" value={form.from} onChange={e => setForm({ ...form, from: e.target.value })}
                className="flex-1 bg-border border-0 rounded-xl px-3 py-2.5 text-sm text-ink" />
              <input placeholder="目的地" value={form.to} onChange={e => setForm({ ...form, to: e.target.value })}
                className="flex-1 bg-border border-0 rounded-xl px-3 py-2.5 text-sm text-ink" />
            </div>

            <div className="flex gap-2">
              <button onClick={() => setShowForm(false)} className="flex-1 bg-surf text-soft py-2.5 rounded-xl text-sm font-medium">取消</button>
              <button onClick={save} className="flex-1 bg-ink text-bg py-2.5 rounded-xl text-sm font-medium">{editing ? '保存' : '添加'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
