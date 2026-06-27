import { useState, useMemo } from 'react'
import { AppData, TodoPhase } from '../types'
import { uid } from '../store'
import { classicTemplate, simpleTemplate, travelTemplate } from '../data/templates'

interface Props { data: AppData; update: (d: AppData) => void }

const phases: TodoPhase[] = ['12月前', '6月前', '3月前', '1月前', '1周前', '当天']
const pStyle: Record<TodoPhase, string> = {
  '12月前': 'bg-sage/20 text-sage', '6月前': 'bg-rose/20 text-deeprose',
  '3月前': 'bg-amber-100 text-amber-800', '1月前': 'bg-orange-100 text-orange-800',
  '1周前': 'bg-red-100 text-red-700', '当天': 'bg-deeprose/20 text-deeprose',
}

export default function TodoList({ data, update }: Props) {
  const [text, setText] = useState(''); const [phase, setPhase] = useState<TodoPhase>('6月前')
  const [filter, setFilter] = useState<TodoPhase | '全部'>('全部')
  const filtered = useMemo(() => filter === '全部' ? data.todos : data.todos.filter(t => t.phase === filter), [data.todos, filter])
  const done = data.todos.filter(t => t.completed).length; const pct = data.todos.length ? Math.round(done / data.todos.length * 100) : 0
  const toggle = (id: string) => update({ ...data, todos: data.todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t) })
  const remove = (id: string) => update({ ...data, todos: data.todos.filter(t => t.id !== id) })
  const add = () => { if (!text.trim()) return; update({ ...data, todos: [...data.todos, { id: uid(), text, completed: false, phase, category: '自定义' }] }); setText('') }
  const load = (n: '经典' | '简约' | '旅行') => {
    if (data.todos.length && !confirm('追加到现有列表？')) return
    const tpl = n === '经典' ? classicTemplate : n === '简约' ? simpleTemplate : travelTemplate
    update({ ...data, todos: [...data.todos, ...tpl.map(t => ({ ...t, id: uid() }))] })
  }

  return (
    <div className="p-5 space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-ink">📋 待办清单</h2>
        <span className="text-sm text-softink">{done}/{data.todos.length}</span>
      </div>
      <div className="bg-warm rounded-full h-2 overflow-hidden">
        <div className="bg-ink h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>

      {data.todos.length === 0 && (
        <div className="bg-warm/50 rounded-2xl p-4 space-y-2">
          <p className="text-sm text-softink font-medium">📥 一键导入模板</p>
          <div className="grid grid-cols-3 gap-2">
            {([['经典', '🏰'], ['简约', '🏡'], ['旅行', '✈️']] as const).map(([n, e]) => (
              <button key={n} onClick={() => load(n)} className="bg-white rounded-xl py-2.5 text-xs font-medium text-softink hover:bg-warm transition-colors">{e} {n}</button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-1 flex-wrap">
        {['全部', ...phases].map(f => (
          <button key={f} onClick={() => setFilter(f as TodoPhase | '全部')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filter === f ? 'bg-ink text-white' : 'bg-warm/70 text-softink hover:bg-warm'}`}
          >{f}</button>
        ))}
      </div>

      <ul className="space-y-1.5">
        {filtered.map(t => (
          <li key={t.id} onClick={() => toggle(t.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${t.completed ? 'bg-warm/40 opacity-60' : 'bg-white/70 hover:bg-white border border-warm/50'}`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${t.completed ? 'bg-ink border-ink' : 'border-warm'}`}>
              {t.completed && <span className="text-white text-[10px]">✓</span>}
            </div>
            <span className={`flex-1 text-sm ${t.completed ? 'line-through text-softink/50' : 'text-ink'}`}>{t.text}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${pStyle[t.phase]}`}>{t.phase}</span>
            <button onClick={e => { e.stopPropagation(); remove(t.id) }} className="text-softink/40 hover:text-red-500 text-xs">✕</button>
          </li>
        ))}
        {filtered.length === 0 && <p className="text-center text-softink/60 text-sm py-12">暂无待办</p>}
      </ul>

      <div className="flex gap-2">
        <select value={phase} onChange={e => setPhase(e.target.value as TodoPhase)} className="bg-warm/70 border-0 rounded-xl px-3 py-2.5 text-sm text-softink">
          {phases.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} placeholder="输入待办..." className="flex-1 bg-warm/70 border-0 rounded-xl px-4 py-2.5 text-sm text-ink placeholder:text-softink/50" />
        <button onClick={add} className="bg-ink text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-softink transition-colors">添加</button>
      </div>
    </div>
  )
}
