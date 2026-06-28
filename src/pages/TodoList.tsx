import { useState, useMemo } from 'react'
import { AppData, TodoPhase } from '../types'
import { uid } from '../store'
import Menu from '../components/Menu'
import { classicTemplate, simpleTemplate, travelTemplate } from '../data/templates'

interface Props { data: AppData; update: (d: AppData) => void }

const phases: TodoPhase[] = ['12月前', '6月前', '3月前', '1月前', '1周前', '当天']
const pStyle: Record<TodoPhase, string> = {
  '12月前': 'bg-sage/20 text-sage', '6月前': 'bg-mauve/20 text-deepmauve',
  '3月前': 'bg-amber/15 text-amber', '1月前': 'bg-amber/15 text-amber',
  '1周前': 'bg-red/15 text-red', '当天': 'bg-deepmauve/20 text-deepmauve',
}

export default function TodoList({ data, update }: Props) {
  const [text, setText] = useState(''); const [phase, setPhase] = useState<TodoPhase>('6月前')
  const [filter, setFilter] = useState<TodoPhase | '全部'>('全部')
  const [showForm, setShowForm] = useState(false)

  const filtered = useMemo(() => filter === '全部' ? data.todos : data.todos.filter(t => t.phase === filter), [data.todos, filter])
  const done = data.todos.filter(t => t.completed).length; const pct = data.todos.length ? Math.round(done / data.todos.length * 100) : 0
  const toggle = (id: string) => update({ ...data, todos: data.todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t) })
  const remove = (id: string) => update({ ...data, todos: data.todos.filter(t => t.id !== id) })
  const add = () => {
    if (!text.trim()) return
    update({ ...data, todos: [...data.todos, { id: uid(), text, completed: false, phase, category: '自定义' }] })
    setText(''); setShowForm(false)
  }
  const load = (n: '经典' | '简约' | '旅行') => {
    if (data.todos.length && !confirm('追加到现有列表？')) return
    const tpl = n === '经典' ? classicTemplate : n === '简约' ? simpleTemplate : travelTemplate
    update({ ...data, todos: [...data.todos, ...tpl.map(t => ({ ...t, id: uid() }))] })
  }

  return (
    <div className="p-5 space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-ink">📋 待办清单</h2>
        <span className="text-sm text-soft">{done}/{data.todos.length}</span>
      </div>
      <div className="bg-surf rounded-full h-2 overflow-hidden">
        <div className="bg-ink h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>

      {data.todos.length === 0 && (
        <div className="bg-border rounded-2xl p-4 space-y-2">
          <p className="text-sm text-soft font-medium">📥 一键导入模板</p>
          <div className="grid grid-cols-3 gap-2">
            {([['经典', '🏰'], ['简约', '🏡'], ['旅行', '✈️']] as const).map(([n, e]) => (
              <button key={n} onClick={() => load(n)} className="bg-elev rounded-xl py-2.5 text-xs font-medium text-soft hover:bg-surf transition-colors">{e} {n}</button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-1 flex-wrap">
        {['全部', ...phases].map(f => (
          <button key={f} onClick={() => setFilter(f as TodoPhase | '全部')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filter === f ? 'bg-ink text-bg' : 'bg-border text-soft hover:bg-surf'}`}
          >{f}</button>
        ))}
      </div>

      <ul className="space-y-1.5">
        {filtered.map(t => (
          <li key={t.id} onClick={() => toggle(t.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${t.completed ? 'bg-border opacity-60' : 'bg-surf hover:bg-elev border border-border'}`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${t.completed ? 'bg-ink border-ink' : 'border-border'}`}>
              {t.completed && <span className="text-white text-[10px]">✓</span>}
            </div>
            <span className={`flex-1 text-sm ${t.completed ? 'line-through text-mute/80 decoration-2' : 'text-ink'}`}>{t.text}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${pStyle[t.phase]}`}>{t.phase}</span>
            <button onClick={e => { e.stopPropagation(); remove(t.id) }} className="text-mute hover:text-red text-xs">✕</button>
          </li>
        ))}
        {filtered.length === 0 && <div className="text-center py-16"><p className="text-5xl mb-3 opacity-30">📋</p><p className="text-mute text-sm">点击 ＋ 添加待办</p></div>}
      </ul>

      {/* 浮动添加按钮 */}
      <button onClick={() => { setText(''); setPhase('6月前'); setShowForm(true) }}
        className="fixed bottom-24 right-4 lg:right-8 z-40 bg-deepmauve text-white w-14 h-14 rounded-full shadow-lg text-2xl font-light hover:opacity-90 transition-all active:scale-95 flex items-center justify-center">
        ＋
      </button>

      {/* 弹窗 */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center" onClick={() => setShowForm(false)}>
          <div className="bg-elev rounded-t-3xl sm:rounded-3xl p-5 w-full max-w-lg space-y-4 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-ink">添加待办</h3>
            <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()}
              placeholder="输入待办事项..." autoFocus
              className="w-full bg-border border-0 rounded-xl px-4 py-3 text-sm text-ink placeholder:text-mute" />
            <select value={phase} onChange={e => setPhase(e.target.value as TodoPhase)}
              className="w-full bg-border border-0 rounded-xl px-3 py-2.5 text-sm text-soft">
              {phases.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <div className="flex gap-2">
              <button onClick={() => setShowForm(false)} className="flex-1 bg-surf text-soft py-2.5 rounded-xl text-sm font-medium">取消</button>
              <button onClick={add} className="flex-1 bg-ink text-bg py-2.5 rounded-xl text-sm font-medium">添加</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
