import { WeddingInfo, BudgetCategory } from '../types'

/** 默认婚礼信息 */
export const defaultWeddingInfo: WeddingInfo = {
  brideName: '',
  groomName: '',
  weddingDate: '',
  totalBudget: 0,
}

/** 默认分类预算（中式） */
export const defaultBudgetCategories: BudgetCategory[] = [
  { key: 'venue', name: '婚宴酒席', budget: 0, spent: 0, color: '#FF6B6B', ratio: 45 },
  { key: 'dress', name: '婚纱礼服', budget: 0, spent: 0, color: '#FFA07A', ratio: 10 },
  { key: 'decoration', name: '婚庆布置', budget: 0, spent: 0, color: '#FFD93D', ratio: 15 },
  { key: 'photo', name: '摄影摄像', budget: 0, spent: 0, color: '#6BCB77', ratio: 8 },
  { key: 'jewelry', name: '珠宝首饰', budget: 0, spent: 0, color: '#4D96FF', ratio: 10 },
  { key: 'car', name: '婚车', budget: 0, spent: 0, color: '#9B59B6', ratio: 5 },
  { key: 'other', name: '其他', budget: 0, spent: 0, color: '#95A5A6', ratio: 7 },
]

/** 默认邀请码 */
export const defaultInviteCode = Math.floor(100000 + Math.random() * 900000).toString()
