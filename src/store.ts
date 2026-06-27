import { AppData, Guest } from './types'
import { defaultWeddingInfo, defaultBudgetCategories, defaultInviteCode } from './data/defaults'
import { seedData } from './data/seed'
import * as XLSX from 'xlsx'

const STORAGE_KEY = 'wedding_planner_data'

export function hashStr(s: string): string {
  let h = 0; for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0
  return h.toString(36)
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      if (!data.weddingInfo?.weddingDate) return JSON.parse(JSON.stringify(seedData))
      const guests = (data.guests || []).map((g: any) => ({
        id: g.id, name: g.name || '', contact: g.contact || '', phone: g.phone || '',
        estimated: g.estimated ?? g.count ?? 1,
        confirmed: g.confirmed ?? (g.rsvp === '确认到场' ? (g.count || 0) : 0),
        side: g.side || '男方', relation: g.relation || '亲戚',
        rsvp: g.rsvp === '确认到场' ? '已确认' : g.rsvp === '无法到场' ? '已拒绝' : (g.rsvp || '待确认'),
        giftAmount: g.giftAmount || 0, note: g.note || '',
      }))
      const expenses = (data.expenses || []).map((e: any) => ({
        id: e.id, categoryKey: e.categoryKey, amount: e.amount, note: e.note || '', date: e.date || '',
      }))
      return {
        weddingInfo: { ...defaultWeddingInfo, ...data.weddingInfo },
        milestones: data.milestones?.length ? data.milestones : seedData.milestones,
        todos: data.todos || [], budgetCategories: data.budgetCategories?.length ? data.budgetCategories : defaultBudgetCategories,
        expenses, guests, cars: data.cars || [], inviteCode: data.inviteCode || defaultInviteCode,
      }
    }
  } catch (e) { console.error(e) }
  return getDefaultData()
}

export function getDefaultData(): AppData { return JSON.parse(JSON.stringify(seedData)) }
export function saveData(data: AppData): void { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) }
export function resetData(): void { localStorage.removeItem(STORAGE_KEY) }
export function uid(): string { return Date.now().toString(36) + Math.random().toString(36).slice(2) }

export function exportXLSX(data: AppData): void {
  const wb = XLSX.utils.book_new()
  const a = XLSX.utils

  a.book_append_sheet(wb, a.json_to_sheet(data.todos.map(t => ({ 完成: t.completed ? '✓' : '', 待办事项: t.text, 阶段: t.phase, 分类: t.category }))), '待办清单')
  a.book_append_sheet(wb, a.json_to_sheet(data.guests.map(g => ({ 分组名: g.name, 方: g.side, 关系: g.relation, 联系人: g.contact, 电话: g.phone, 预计人数: g.estimated, 确认人数: g.confirmed, RSVP: g.rsvp, 礼金: g.giftAmount, 备注: g.note }))), '宾客名单')

  const cm: Record<string, number> = {}; data.budgetCategories.forEach(c => cm[c.key] = 0); data.expenses.forEach(e => cm[e.categoryKey] = (cm[e.categoryKey] || 0) + e.amount)
  const br = data.budgetCategories.map(c => ({ 分类: c.name, 预算元: c.budget, 已花费元: cm[c.key] || 0, 剩余元: c.budget - (cm[c.key] || 0) }))
  const ts = Object.values(cm).reduce((x, y) => x + y, 0); br.push({ 分类: '合计', 预算元: data.budgetCategories.reduce((s, c) => s + c.budget, 0), 已花费元: ts, 剩余元: data.budgetCategories.reduce((s, c) => s + c.budget, 0) - ts })
  a.book_append_sheet(wb, a.json_to_sheet(br), '预算汇总')

  a.book_append_sheet(wb, a.json_to_sheet(data.expenses.map(e => ({ 日期: e.date, 分类: data.budgetCategories.find(c => c.key === e.categoryKey)?.name || e.categoryKey, 金额元: e.amount, 备注: e.note }))), '支出明细')
  a.book_append_sheet(wb, a.json_to_sheet(data.cars.map(c => ({ 类型: c.type, 车牌: c.plate, 司机: c.driver, 电话: c.driverPhone, 乘客: c.passengers, 出发地: c.from, 目的地: c.to }))), '婚车')
  a.book_append_sheet(wb, a.json_to_sheet([{ 新郎: data.weddingInfo.groomName, 新娘: data.weddingInfo.brideName, 婚期: data.weddingInfo.weddingDate, 总预算: data.weddingInfo.totalBudget }]), '基本信息')

  XLSX.writeFile(wb, 'WeddingData.xlsx', { bookType: 'xlsx', type: 'binary' })
}

export function exportGuestXLSX(guests: Guest[]): void {
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(guests.map(g => ({ 分组名: g.name, 方: g.side, 关系: g.relation, 联系人: g.contact, 电话: g.phone, 预计人数: g.estimated, 确认人数: g.confirmed, RSVP: g.rsvp, 礼金: g.giftAmount, 备注: g.note }))), '宾客名单')
  XLSX.writeFile(wb, 'GuestList.xlsx', { bookType: 'xlsx', type: 'binary' })
}

