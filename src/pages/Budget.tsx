import { useState, useMemo } from 'react'
import { AppData, Expense, BudgetCategory } from '../types'
import { uid } from '../store'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface Props { data: AppData; update: (d: AppData) => void }

const catColors: Record<string, string> = {
  venue: '#8B3A3A', dress: '#8B6914', decoration: '#6B5B7A',
  photo: '#5C7A5A', jewelry: '#B87C4A', car: '#7A5B8C', other: '#4A4A4A',
}

export default function Budget({ data, update }: Props) {
  const { budgetCategories, expenses, weddingInfo } = data
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0)
  const totalBudget = weddingInfo.totalBudget || budgetCategories.reduce((s, c) => s + c.budget, 0)

  const [showCatModal, setShowCatModal] = useState(false)
  const [catDraft, setCatDraft] = useState<BudgetCategory[]>([])
  const [showExpModal, setShowExpModal] = useState(false)
  const [expForm, setExpForm] = useState({ categoryKey: 'venue', amount: '', note: '' })

  const categorySpent = useMemo(() => {
    const map: Record<string, number> = {}; expenses.forEach(e => { map[e.categoryKey] = (map[e.categoryKey] || 0) + e.amount }); return map
  }, [expenses])

  const pieData = budgetCategories.map(c => ({ name: c.name, value: categorySpent[c.key] || 0, color: catColors[c.key] || '#4A4A4A' })).filter(d => d.value > 0)

  const openCatModal = () => { setCatDraft(budgetCategories.map(c => ({ ...c, spent: categorySpent[c.key] || 0 }))); setShowCatModal(true) }
  const saveCategories = () => { update({ ...data, budgetCategories: catDraft.map(c => ({ key: c.key, name: c.name, budget: c.budget, spent: 0, color: c.color, ratio: c.ratio })) }); setShowCatModal(false) }

  const openExpModal = () => { setExpForm({ categoryKey: 'venue', amount: '', note: '' }); setShowExpModal(true) }
  const addExpense = () => {
    const amt = parseFloat(expForm.amount); if (!amt || amt <= 0) return
    update({ ...data, expenses: [...expenses, { id: uid(), categoryKey: expForm.categoryKey, amount: amt, note: expForm.note, date: new Date().toISOString().slice(0, 10) }] })
    setShowExpModal(false)
  }

  return (
    <div className="p-5 space-y-5 pb-20">
      <h2 className="text-lg font-bold text-ink">💰 预算追踪</h2>

      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          ['总预算', `¥${(totalBudget / 10000).toFixed(1)}万`, 'bg-deeprose/10 text-deeprose'],
          ['已花费', `¥${(totalSpent / 10000).toFixed(1)}万`, 'bg-sage/10 text-sage'],
          ['剩余', `¥${((totalBudget - totalSpent) / 10000).toFixed(1)}万`, 'bg-warm/70 text-softink'],
        ].map(([l, v, cls], i) => (
          <div key={i} className={`${cls} rounded-2xl p-3`}><p className="text-xs opacity-70">{l}</p><p className="text-base font-bold mt-0.5">{v}</p></div>
        ))}
      </div>

      {pieData.length > 0 && (
        <div className="h-44">
          <ResponsiveContainer><PieChart><Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65} innerRadius={30}>{pieData.map((d, i) => <Cell key={i} fill={d.color} />)}</Pie><Tooltip formatter={(v: number) => `¥${v.toLocaleString()}`} /></PieChart></ResponsiveContainer>
        </div>
      )}

      <section className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold text-softink">分类预算</h3>
          <button onClick={openCatModal} className="text-sm text-deeprose font-medium hover:underline">✎ 修改</button>
        </div>
        <div className="bg-white/50 rounded-2xl p-4 border border-warm space-y-3">
          {budgetCategories.map(c => {
            const spent = categorySpent[c.key] || 0; const pct = c.budget ? Math.min(spent / c.budget * 100, 100) : 0
            return (
              <div key={c.key} className="flex items-center gap-3">
                <span className="text-sm text-softink w-16 shrink-0">{c.name}</span>
                <div className="flex-1 bg-warm rounded-full h-2 overflow-hidden"><div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: catColors[c.key] }} /></div>
                <span className="text-xs text-softink/80 text-right w-28">¥{spent.toLocaleString()} / ¥{c.budget.toLocaleString()}</span>
              </div>
            )
          })}
        </div>
      </section>

      <section className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold text-softink">支出记录</h3>
          <button onClick={openExpModal} className="text-sm text-deeprose font-medium hover:underline">＋ 记一笔</button>
        </div>
        {expenses.length > 0 ? (
          <ul className="bg-white/50 rounded-2xl p-3 border border-warm space-y-1 max-h-60 overflow-auto">
            {[...expenses].reverse().map(e => {
              const cat = budgetCategories.find(c => c.key === e.categoryKey)
              return (
                <li key={e.id} className="flex items-center justify-between text-sm py-1.5 px-1 border-b border-warm last:border-0">
                  <span className="text-softink truncate flex-1 mr-2">{e.note || cat?.name || e.categoryKey}</span>
                  <span className="text-ink font-semibold shrink-0 mx-2">¥{e.amount.toLocaleString()}</span>
                  <button onClick={() => update({ ...data, expenses: expenses.filter(x => x.id !== e.id) })} className="text-softink/40 hover:text-red-500 text-xs shrink-0">✕</button>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="text-center text-softink/60 text-sm py-6 bg-white/50 rounded-2xl border border-warm">还没有支出记录</div>
        )}
      </section>

      {/* 分类预算弹窗 */}
      {showCatModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-end sm:items-center justify-center" onClick={() => setShowCatModal(false)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-5 w-full max-w-lg space-y-4 max-h-[80vh] overflow-auto shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-ink">✎ 修改分类预算</h3>
            {catDraft.map(c => {
              const spent = categorySpent[c.key] || 0
              return (
                <div key={c.key} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-softink font-medium">{c.name}</span>
                      <button onClick={() => setCatDraft(p => p.filter(x => x.key !== c.key))} className="text-red-400 hover:text-red-600 text-xs">删除</button>
                    </div>
                    <span className="text-softink/70">已花 ¥{spent.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2"><span className="text-softink/60 text-sm">¥</span><input type="number" value={c.budget || ''} onChange={e => setCatDraft(p => p.map(x => x.key === c.key ? { ...x, budget: +e.target.value || 0 } : x))} className="flex-1 bg-warm/70 border-0 rounded-xl px-3 py-2.5 text-lg font-bold text-ink" /><span className="text-softink/50 text-xs">{c.ratio}%</span></div>
                </div>
              )
            })}
            <div className="flex gap-2">
              <button onClick={() => setShowCatModal(false)} className="flex-1 bg-warm/70 text-softink py-2.5 rounded-xl text-sm font-medium">取消</button>
              <button onClick={saveCategories} className="flex-1 bg-ink text-white py-2.5 rounded-xl text-sm font-medium">确认保存</button>
            </div>
            <button onClick={() => {
              const key = 'custom_' + Date.now()
              setCatDraft(p => [...p, { key, name: '新分类', budget: 0, spent: 0, color: '#4A4A4A', ratio: 0 }])
            }} className="w-full bg-warm/70 text-softink py-2 rounded-xl text-sm">＋ 添加分类</button>
          </div>
        </div>
      )}

      {/* 记账弹窗 */}
      {showExpModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-end sm:items-center justify-center" onClick={() => setShowExpModal(false)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-5 w-full max-w-lg space-y-4 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-ink">📝 记一笔支出</h3>
            <select value={expForm.categoryKey} onChange={e => setExpForm(s => ({ ...s, categoryKey: e.target.value }))} className="w-full bg-warm/70 border-0 rounded-xl px-3 py-2.5 text-sm text-softink">{budgetCategories.map(c => <option key={c.key} value={c.key}>{c.name}</option>)}</select>
            <div className="flex items-center gap-2"><span className="text-softink/60 text-sm">¥</span><input type="number" placeholder="金额" value={expForm.amount} onChange={e => setExpForm(s => ({ ...s, amount: e.target.value }))} className="flex-1 bg-warm/70 border-0 rounded-xl px-3 py-2.5 text-lg font-bold text-ink" /></div>
            <textarea placeholder="备注：供应商名称、合同金额、付款节点" value={expForm.note} onChange={e => setExpForm(s => ({ ...s, note: e.target.value }))} className="w-full bg-warm/70 border-0 rounded-xl px-3 py-2.5 text-sm text-ink resize-none" rows={2} />
            <div className="flex gap-2"><button onClick={() => setShowExpModal(false)} className="flex-1 bg-warm/70 text-softink py-2.5 rounded-xl text-sm font-medium">取消</button><button onClick={addExpense} className="flex-1 bg-ink text-white py-2.5 rounded-xl text-sm font-medium">确认添加</button></div>
          </div>
        </div>
      )}
    </div>
  )
}
