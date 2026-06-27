import { useState, useMemo } from 'react'
import { AppData, Guest } from '../types'
import { uid } from '../store'

interface Props { data: AppData; update: (d: AppData) => void }

const RSVP_OPTIONS: { v: Guest['rsvp']; label: string }[] = [
  { v: '待确认', label: '📞 待确认' },
  { v: '已确认', label: '✅ 已确认' },
  { v: '已拒绝', label: '❌ 已拒绝' },
]

const REL_OPTIONS = ['亲戚', '朋友', '同事', '同学']

const empty = (): Guest => ({
  id: '', name: '', contact: '', phone: '', estimated: 1, confirmed: 0,
  side: '男方', relation: '亲戚', rsvp: '待确认', giftAmount: 0, note: '',
})

export default function Guests({ data, update }: Props) {
  const guests = data.guests
  const [filter, setFilter] = useState<'全部' | '男方' | '女方'>('全部')
  const [form, setForm] = useState<Guest>(empty())
  const [editing, setEditing] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const filtered = useMemo(() => filter === '全部' ? guests : guests.filter(g => g.side === filter), [guests, filter])

  // 统计：用确认人数
  const totalEstimated = guests.reduce((s, g) => s + g.estimated, 0)
  const totalConfirmed = guests.filter(g => g.rsvp !== '已拒绝').reduce((s, g) => s + (g.confirmed || g.estimated), 0)
  const totalGift = guests.filter(g => g.rsvp !== '已拒绝').reduce((s, g) => s + g.giftAmount, 0)
  const rsvpRate = guests.length ? guests.filter(g => g.rsvp !== '待确认').length : 0

  const save = () => {
    if (!form.name.trim()) return
    if (editing) {
      update({ ...data, guests: guests.map(g => g.id === editing ? form : g) })
    } else {
      update({ ...data, guests: [...guests, { ...form, id: uid() }] })
    }
    setForm(empty()); setEditing(null); setShowForm(false)
  }

  const edit = (g: Guest) => { setForm({ ...g }); setEditing(g.id); setShowForm(true) }
  const remove = (id: string) => { if (confirm('删除这个宾客组？')) update({ ...data, guests: guests.filter(g => g.id !== id) }) }

  const setRSVP = (id: string, rsvp: Guest['rsvp']) => {
    const g = guests.find(x => x.id === id)
    if (!g) return
    const confirmed = rsvp === '已确认' ? (g.confirmed || g.estimated) : rsvp === '已拒绝' ? 0 : g.confirmed
    update({ ...data, guests: guests.map(x => x.id === id ? { ...x, rsvp, confirmed } : x) })
  }

  return (
    <div className="p-5 space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ink">👥 宾客管理</h2>
        <button onClick={() => { setForm(empty()); setEditing(null); setShowForm(true) }}
          className="bg-deeprose text-white px-4 py-1.5 rounded-full text-sm font-medium">＋ 添加</button>
      </div>

      {/* 汇总 */}
      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          [`${guests.length}`, '组宾客'],
          [`${totalConfirmed}`, '确认到场'],
          [`${Math.ceil(totalConfirmed / 10)}`, '建议桌数'],
          [`¥${(totalGift / 10000).toFixed(1)}万`, '礼金'],
        ].map(([v, l], i) => (
          <div key={i} className="bg-white/70 rounded-2xl p-3 border border-warm/50">
            <p className="text-base font-serif text-deeprose font-semibold">{v}</p>
            <p className="text-[10px] text-softink/50 mt-0.5">{l}</p>
          </div>
        ))}
      </div>

      {/* 进度 */}
      <div className="flex items-center gap-2 text-xs text-softink/50">
        <span>已确认 {rsvpRate}/{guests.length} 组</span>
        <div className="flex-1 bg-warm/40 rounded-full h-1.5 overflow-hidden">
          <div className="bg-sage h-full rounded-full transition-all" style={{ width: `${guests.length ? (rsvpRate / guests.length) * 100 : 0}%` }} />
        </div>
      </div>

      {/* 筛选 */}
      <div className="flex gap-2">
        {(['全部', '男方', '女方'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors
              ${filter === f ? 'bg-deeprose text-white' : 'bg-warm/50 text-softink/70 hover:bg-warm'}`}
          >{f} ({f === '全部' ? guests.length : guests.filter(g => g.side === f).length})</button>
        ))}
      </div>

      {/* 宾客卡片 */}
      <div className="space-y-2">
        {filtered.map(g => (
          <div key={g.id}
            className={`bg-white/70 rounded-2xl px-4 py-3 border transition-all cursor-pointer
              ${g.rsvp === '已确认' ? 'border-sage/30 bg-sage/5' :
                g.rsvp === '已拒绝' ? 'border-gray-200 bg-gray-50 opacity-60' :
                'border-warm/50 hover:border-rose/20'}`}
          >
            {/* 第一行：名称 + 方 + 编辑删除 */}
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <span className="font-medium text-softink">{g.name}</span>
                <span className={`text-xs ml-2 px-1.5 py-0.5 rounded-full font-medium
                  ${g.side === '男方' ? 'bg-rose/15 text-deeprose' : 'bg-sage/15 text-sage'}`}
                >{g.side}</span>
                <span className="text-xs text-softink/40 ml-1">{g.relation}</span>
              </div>
              <div className="flex gap-1 shrink-0 ml-2">
                <button onClick={() => edit(g)} className="text-softink/30 hover:text-deeprose text-sm">✎</button>
                <button onClick={() => remove(g.id)} className="text-softink/30 hover:text-red-400 text-sm">✕</button>
              </div>
            </div>

            {/* 第二行：人数 + 联系人 */}
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-softink/60">
              <span>👥 预计{g.estimated}人 · 确认{g.confirmed}人</span>
              {g.contact && <span>📞 {g.contact}{g.phone ? ` ${g.phone}` : ''}</span>}
            </div>

            {/* 第三行：RSVP + 礼金 */}
            <div className="mt-2 flex items-center gap-1 flex-wrap">
              {RSVP_OPTIONS.map(o => (
                <button key={o.v} onClick={() => setRSVP(g.id, o.v)}
                  className={`text-xs px-2 py-0.5 rounded-full border font-medium transition-colors
                    ${g.rsvp === o.v
                      ? o.v === '已确认' ? 'bg-sage text-white border-sage'
                      : o.v === '已拒绝' ? 'bg-gray-400 text-white border-gray-400'
                      : 'bg-amber-400 text-white border-amber-400'
                      : 'bg-white text-softink/40 border-warm/30 hover:border-warm/50'}`}
                >{o.label}</button>
              ))}
              <div className="flex-1" />
              <span className="text-sm text-softink/70 font-medium">¥{g.giftAmount.toLocaleString()}</span>
            </div>

            {g.note && <p className="mt-1 text-[10px] text-softink/40">💬 {g.note}</p>}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center text-softink/50 text-sm py-16 space-y-2">
            <p className="text-4xl">👰</p>
            <p>还没有添加宾客</p>
            <p className="text-xs">点击右上角 ＋ 添加第一组宾客</p>
          </div>
        )}
      </div>

      {/* 表单弹窗 */}
      {showForm && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-end sm:items-center justify-center" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-5 w-full max-w-lg space-y-3 max-h-[80vh] overflow-auto shadow-xl"
            onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-ink">{editing ? '编辑宾客' : '添加宾客'}</h3>

            <div className="flex gap-2">
              <select value={form.side} onChange={e => setForm({ ...form, side: e.target.value as '男方' | '女方' })}
                className="bg-warm/50 border-0 rounded-xl px-3 py-2.5 text-sm text-softink">
                <option value="男方">男方</option><option value="女方">女方</option>
              </select>
              <select value={form.relation} onChange={e => setForm({ ...form, relation: e.target.value })}
                className="bg-warm/50 border-0 rounded-xl px-3 py-2.5 text-sm text-softink">
                {REL_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <input placeholder="分组名，如：张三家" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full bg-warm/50 border-0 rounded-xl px-3 py-2.5 text-sm text-softink" />

            <div className="flex gap-2">
              <input placeholder="联系人" value={form.contact}
                onChange={e => setForm({ ...form, contact: e.target.value })}
                className="flex-1 bg-warm/50 border-0 rounded-xl px-3 py-2.5 text-sm text-softink" />
              <input placeholder="电话" value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="flex-1 bg-warm/50 border-0 rounded-xl px-3 py-2.5 text-sm text-softink" />
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-[10px] text-softink/40 ml-1">预计人数</label>
                <input type="number" value={form.estimated || ''}
                  onChange={e => setForm({ ...form, estimated: +e.target.value || 0 })}
                  className="w-full bg-warm/50 border-0 rounded-xl px-3 py-2.5 text-sm text-softink" />
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-softink/40 ml-1">确认到场</label>
                <input type="number" value={form.confirmed || ''}
                  onChange={e => setForm({ ...form, confirmed: +e.target.value || 0 })}
                  className="w-full bg-warm/50 border-0 rounded-xl px-3 py-2.5 text-sm text-softink" />
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-softink/40 ml-1">礼金</label>
                <input type="number" value={form.giftAmount || ''}
                  onChange={e => setForm({ ...form, giftAmount: +e.target.value || 0 })}
                  className="w-full bg-warm/50 border-0 rounded-xl px-3 py-2.5 text-sm text-softink" />
              </div>
            </div>

            <input placeholder="备注（饮食禁忌等）" value={form.note}
              onChange={e => setForm({ ...form, note: e.target.value })}
              className="w-full bg-warm/50 border-0 rounded-xl px-3 py-2.5 text-sm text-softink" />

            <div className="flex gap-2">
              <button onClick={() => setShowForm(false)}
                className="flex-1 bg-warm/50 text-softink/60 py-2.5 rounded-xl text-sm">取消</button>
              <button onClick={save}
                className="flex-1 bg-deeprose text-white py-2.5 rounded-xl text-sm font-medium">
                {editing ? '✎ 保存' : '＋ 添加'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
