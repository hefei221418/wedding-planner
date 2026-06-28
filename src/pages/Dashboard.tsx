import { useMemo } from 'react'
import { AppData } from '../types'
import Countdown from '../components/Countdown'
import ProgressRing from '../components/ProgressRing'
import { tips } from '../data/templates'

interface Props { data: AppData; onInvite?: () => void; onNav?: (tab: string) => void }

export default function Dashboard({ data, onInvite, onNav }: Props) {
  const { weddingInfo, todos, expenses, guests, cars } = data

  // ✅ useMemo 确保 data 变化时重新计算
  const todoPercent = useMemo(() => todos.length ? (todos.filter(t => t.completed).length / todos.length) * 100 : 0, [todos])
  const totalSpent = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses])
  const budgetPercent = useMemo(() => weddingInfo.totalBudget ? Math.min((totalSpent / weddingInfo.totalBudget) * 100, 100) : 0, [weddingInfo.totalBudget, totalSpent])
  const guestPercent = useMemo(() => guests.length ? (guests.filter(g => g.rsvp !== '待确认').length / guests.length) * 100 : 0, [guests])
  const carPercent = useMemo(() => cars.length ? (cars.filter(c => c.driver && c.plate).length / cars.length) * 100 : 0, [cars])
  const tip = useMemo(() => tips[new Date().getDate() % tips.length], [])
  const confirmedGuests = useMemo(() => guests.filter(g => g.rsvp !== '已拒绝').reduce((s, g) => s + (g.confirmed || g.estimated), 0), [guests])

  return (
    <div className="p-5 space-y-6 pb-20">
      <Countdown weddingDate={weddingInfo.weddingDate} brideName={weddingInfo.brideName} groomName={weddingInfo.groomName} />

      {/* 多节点倒计时 */}
      <div className="grid grid-cols-4 lg:grid-cols-4 gap-2 lg:gap-4">
        {(data.milestones || []).map(m => {
          const diff = Math.ceil((new Date(m.date).getTime() - Date.now()) / 86400000)
          return (
            <div key={m.id} className={`bg-surf rounded-2xl p-2.5 border text-center ${diff < 0 ? 'border-sage/30 bg-sage/5' : diff <= 14 ? 'border-red/30 bg-red/10' : 'border-border'}`}>
              <p className="text-sm mb-1">{m.icon}</p>
              <p className={`text-lg font-bold ${diff < 0 ? 'text-sage' : diff <= 14 ? 'text-red' : 'text-ink'}`}>
                {diff < 0 ? '✓' : diff}
              </p>
              <p className="text-[10px] text-soft mt-0.5 leading-tight">{m.name}</p>
              <p className="text-[9px] text-soft">{m.date.slice(5)}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-4 lg:grid-cols-4 gap-2 lg:gap-4">
        {[
          { p: todoPercent, l: '待办', s: `${todos.filter(t => t.completed).length}/${todos.length}`, t: 'todos' },
          { p: budgetPercent, l: '预算', s: `¥${(totalSpent / 10000).toFixed(1)}万`, t: 'budget' },
          { p: guestPercent, l: '宾客', s: `${guests.filter(g => g.rsvp !== '待确认').length}/${guests.length}`, t: 'guests' },
          { p: carPercent, l: '婚车', s: `${cars.length}辆`, t: 'cars' },
        ].map((c, i) => (
          <button key={i} onClick={() => onNav?.(c.t)} className="cursor-pointer">
            <ProgressRing percent={c.p} label={c.l} sub={c.s} />
          </button>
        ))}
      </div>

      <button onClick={onInvite}
        className="w-full bg-deepmauve/10 hover:bg-deepmauve/20 rounded-2xl p-4 border border-deepmauve/20 transition-colors">
        <div className="flex items-center gap-3">
          <span className="text-2xl">💌</span>
          <div className="text-left">
            <p className="text-sm font-semibold text-deepmauve">电子请柬</p>
            <p className="text-xs text-deepmauve/60">点击查看婚礼请柬</p>
          </div>
        </div>
      </button>

      <div className="bg-surf rounded-2xl p-4 border border-border">
        <div className="flex gap-2"><span className="text-lg shrink-0">💡</span><p className="text-sm text-soft leading-relaxed">{tip}</p></div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <button onClick={() => onNav?.('guests')} className="bg-surf rounded-2xl p-4 border border-border text-center hover:bg-elev transition-colors">
          <p className="text-3xl font-serif text-ink">{confirmedGuests}<span className="text-lg text-soft"> 人</span></p>
          <p className="text-xs text-soft mt-1">确认到场</p>
        </button>
        <button onClick={() => onNav?.('guests')} className="bg-surf rounded-2xl p-4 border border-border text-center hover:bg-elev transition-colors">
          <p className="text-3xl font-serif text-ink">{Math.ceil(confirmedGuests / 10)}<span className="text-lg text-soft"> 桌</span></p>
          <p className="text-xs text-soft mt-1">建议桌数（10人/桌）</p>
        </button>
      </div>
    </div>
  )
}
