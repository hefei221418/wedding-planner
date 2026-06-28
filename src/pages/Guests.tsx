import { useState, useMemo } from 'react'
import { AppData, Guest } from '../types'
import { uid } from '../store'
import Menu from '../components/Menu'

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
      <h2 className="text-lg font-bold text-ink">👥 宾客管理</h2>

      {/* 汇总 */}
      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          [`${guests.length}`, '组宾客'],
          [`${totalConfirmed}`, '确认到场'],
          [`${Math.ceil(totalConfirmed / 10)}`, '建议桌数'],
          [`¥${(totalGift / 10000).toFixed(1)}万`, '礼金'],
        ].map(([v, l], i) => (
          <div key={i} className="bg-surf rounded-2xl p-3 border border-border">
            <p className="text-base font-serif text-deepmauve font-semibold">{v}</p>
            <p className="text-[10px] text-mute mt-0.5">{l}</p>
          </div>
        ))}
      </div>

      {/* 进度 */}
      <div className="flex items-center gap-2 text-xs text-mute">
        <span>已确认 {rsvpRate}/{guests.length} 组</span>
        <div className="flex-1 bg-border rounded-full h-1.5 overflow-hidden">
          <div className="bg-sage h-full rounded-full transition-all" style={{ width: `${guests.length ? (rsvpRate / guests.length) * 100 : 0}%` }} />
        </div>
      </div>

      {/* 筛选 */}
      <div className="flex gap-2">
        {(['全部', '男方', '女方'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors
              ${filter === f ? 'bg-deepmauve text-white' : 'bg-border text-soft hover:bg-surf'}`}
          >{f} ({f === '全部' ? guests.length : guests.filter(g => g.side === f).length})</button>
        ))}
      </div>

      {/* 宾客卡片 */}
      <div className="space-y-2">
{filtered.map(g => (
          <div key={g.id}
            className={`rounded-xl px-3 py-2 border text-sm ${g.rsvp === '已确认' ? 'bg-sage/5 border-sage/20' :
              g.rsvp === '已拒绝' ? 'bg-surf border-border opacity-60' :
              'bg-surf border-border'}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-semibold text-ink truncate">{g.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold shrink-0 ${g.side === '男方' ? 'bg-deepmauve/15 text-deepmauve' : 'bg-sage/15 text-sage'}`}>{g.side}</span>
                <span className="text-mute text-xs truncate">{g.relation}</span>
              </div>
              <Menu items={[{ label: '编辑', onClick: () => edit(g) }, { label: '删除', onClick: () => remove(g.id), danger: true }]} />
            </div>
            <div className="flex items-center flex-wrap gap-x-3 gap-y-0.5 mt-1 text-xs text-soft">
              {g.contact && <span>📞 {g.contact}{g.phone ? ` ${g.phone}` : ''}</span>}
              <span>👥 预{g.estimated} / 确{g.confirmed}</span>
              {g.giftAmount > 0 && <span className="text-ink font-medium">¥{g.giftAmount.toLocaleString()}</span>}
            </div>
            <div className="flex items-center gap-1 mt-1.5">
              {RSVP_OPTIONS.map(o => (
                <button key={o.v} onClick={() => setRSVP(g.id, o.v)}
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition-colors ${g.rsvp === o.v
                    ? o.v === '已确认' ? 'bg-sage text-white' : o.v === '已拒绝' ? 'bg-mute text-white' : 'bg-softink text-white'
                    : 'bg-border text-mute hover:bg-surf'}`}
                >{o.label}</button>
              ))}
              {g.note && <span className="text-[10px] text-mute ml-auto truncate max-w-[40%]">💬 {g.note}</span>}
            </div>
          </div>
            
        ))}
        {filtered.length === 0 && (
          <div className="text-center text-mute text-sm py-16 space-y-2">
            <p className="text-5xl mb-3 opacity-40">👰</p><p className="text-mute">点击 ＋ 添加宾客</p>
          </div>
        )}
      </div>

      {/* ✅ 浮动添加按钮 */}
      <button onClick={() => { setForm(empty()); setEditing(null); setShowForm(true) }}
        className="fixed bottom-24 right-4 lg:right-8 z-40 bg-water text-white w-14 h-14 rounded-full shadow-lg text-2xl font-light hover:opacity-90 transition-all active:scale-95 flex items-center justify-center">
        ＋
      </button>

      {/* 表单弹窗 */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center" onClick={() => setShowForm(false)}>
          <div className="bg-elev rounded-t-3xl sm:rounded-3xl p-5 w-full max-w-lg space-y-3 max-h-[80vh] overflow-auto shadow-xl"
            onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-ink">{editing ? '编辑宾客' : '添加宾客'}</h3>

            <div className="flex gap-2">
              <select value={form.side} onChange={e => setForm({ ...form, side: e.target.value as '男方' | '女方' })}
                className="bg-border border-0 rounded-xl px-3 py-2.5 text-sm text-soft">
                <option value="男方">男方</option><option value="女方">女方</option>
              </select>
              <select value={form.relation} onChange={e => setForm({ ...form, relation: e.target.value })}
                className="bg-border border-0 rounded-xl px-3 py-2.5 text-sm text-soft">
                {REL_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <input placeholder="分组名，如：张三家" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full bg-border border-0 rounded-xl px-3 py-2.5 text-sm text-soft" />

            <div className="flex gap-2">
              <input placeholder="联系人" value={form.contact}
                onChange={e => setForm({ ...form, contact: e.target.value })}
                className="flex-1 bg-border border-0 rounded-xl px-3 py-2.5 text-sm text-soft" />
              <input placeholder="电话" value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="flex-1 bg-border border-0 rounded-xl px-3 py-2.5 text-sm text-soft" />
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-[10px] text-mute ml-1">预计人数</label>
                <input type="number" value={form.estimated || ''}
                  onChange={e => setForm({ ...form, estimated: +e.target.value || 0 })}
                  className="w-full bg-border border-0 rounded-xl px-3 py-2.5 text-sm text-soft" />
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-mute ml-1">确认到场</label>
                <input type="number" value={form.confirmed || ''}
                  onChange={e => setForm({ ...form, confirmed: +e.target.value || 0 })}
                  className="w-full bg-border border-0 rounded-xl px-3 py-2.5 text-sm text-soft" />
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-mute ml-1">礼金</label>
                <input type="number" value={form.giftAmount || ''}
                  onChange={e => setForm({ ...form, giftAmount: +e.target.value || 0 })}
                  className="w-full bg-border border-0 rounded-xl px-3 py-2.5 text-sm text-soft" />
              </div>
            </div>

            <input placeholder="备注（饮食禁忌等）" value={form.note}
              onChange={e => setForm({ ...form, note: e.target.value })}
              className="w-full bg-border border-0 rounded-xl px-3 py-2.5 text-sm text-soft" />

            <div className="flex gap-2">
              <button onClick={() => setShowForm(false)}
                className="flex-1 bg-border text-soft py-2.5 rounded-xl text-sm">取消</button>
              <button onClick={save}
                className="flex-1 bg-deepmauve text-white py-2.5 rounded-xl text-sm font-medium">
                {editing ? '✎ 保存' : '＋ 添加'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
