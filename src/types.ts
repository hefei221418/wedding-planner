// ==================== 全局类型定义 ====================

/** 日期节点 */
export interface Milestone {
  id: string
  name: string        // "领证" / "主婚场" / "回门宴"
  date: string        // ISO date
  icon: string        // emoji
  done?: boolean      // 已过？
}

/** 导航标签 */
export type Tab = 'dashboard' | 'todos' | 'budget' | 'guests' | 'cars' | 'settings'

/** 婚礼基本信息 */
export interface WeddingInfo {
  brideName: string      // 新娘
  groomName: string      // 新郎
  weddingDate: string    // 婚礼日期 ISO 格式
  totalBudget: number    // 总预算
}

/** 待办事项 */
export interface TodoItem {
  id: string
  text: string
  completed: boolean
  phase: TodoPhase      // 时间阶段
  category: string       // 分类
}

export type TodoPhase = '12月前' | '6月前' | '3月前' | '1月前' | '1周前' | '当天'

/** 预算分类 */
export interface BudgetCategory {
  key: string
  name: string
  budget: number         // 预算金额
  spent: number           // 已花金额（动态计算）
  color: string
  ratio: number           // 建议占比 %
}

/** 支出记录 */
export interface Expense {
  id: string
  categoryKey: string
  amount: number
  note: string             // 备注（可记供应商/合同/付款节点）
  date: string
}

/** 宾客分组（一组=一家人/一对夫妇/一个朋友） */
export interface Guest {
  id: string
  name: string             // 分组名，如"蒋阿姨家"
  contact: string          // 联系人
  phone: string            // 联系人电话
  estimated: number        // 预计人数（最初估算）
  confirmed: number        // 确认到场人数（≤预计）
  side: '男方' | '女方'
  relation: string         // 亲戚 / 朋友 / 同事 / 同学
  rsvp: '待确认' | '已确认' | '已拒绝'
  giftAmount: number       // 礼金
  note: string             // 饮食禁忌等备注
}

/** 婚车 */
export interface Car {
  id: string
  type: '主婚车' | '跟车'
  plate: string
  driver: string
  driverPhone: string
  passengers: string
  from: string
  to: string
}

/** 应用全部数据 */
export interface AppData {
  weddingInfo: WeddingInfo
  milestones: Milestone[]
  todos: TodoItem[]
  budgetCategories: BudgetCategory[]
  expenses: Expense[]
  guests: Guest[]
  cars: Car[]
  inviteCode: string
  version?: number
}
