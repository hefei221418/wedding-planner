import { TodoItem } from '../types'

/** 经典婚礼模板（简化版每组代表性项） */
export const classicTemplate: Omit<TodoItem, 'id'>[] = [
  // 12月前
  { text: '双方父母见面商谈婚期', completed: false, phase: '12月前', category: '筹备' },
  { text: '确定婚礼日期', completed: false, phase: '12月前', category: '筹备' },
  { text: '确定婚礼预算', completed: false, phase: '12月前', category: '预算' },
  { text: '预定婚宴酒店', completed: false, phase: '12月前', category: '场地' },
  { text: '拍婚纱照', completed: false, phase: '12月前', category: '婚纱' },
  // 6月前
  { text: '确定伴郎伴娘人选', completed: false, phase: '6月前', category: '人员' },
  { text: '预定婚庆策划团队', completed: false, phase: '6月前', category: '婚庆' },
  { text: '预定四大金刚（司仪/化妆/摄影/摄像）', completed: false, phase: '6月前', category: '婚庆' },
  { text: '选定婚纱礼服', completed: false, phase: '6月前', category: '婚纱' },
  { text: '选购婚戒及三金', completed: false, phase: '6月前', category: '珠宝' },
  // 3月前
  { text: '拟定宾客名单', completed: false, phase: '3月前', category: '宾客' },
  { text: '发送请帖', completed: false, phase: '3月前', category: '宾客' },
  { text: '预定婚车', completed: false, phase: '3月前', category: '婚车' },
  { text: '确定婚礼流程和司仪沟通', completed: false, phase: '3月前', category: '流程' },
  { text: '试妆', completed: false, phase: '3月前', category: '婚纱' },
  // 1月前
  { text: '确认宾客到场情况', completed: false, phase: '1月前', category: '宾客' },
  { text: '与酒店最终确认桌数和菜单', completed: false, phase: '1月前', category: '场地' },
  { text: '准备喜糖伴手礼', completed: false, phase: '1月前', category: '物品' },
  { text: '婚房布置采购', completed: false, phase: '1月前', category: '物品' },
  { text: '婚礼彩排', completed: false, phase: '1月前', category: '流程' },
  // 1周前
  { text: '最终确认所有供应商', completed: false, phase: '1周前', category: '流程' },
  { text: '准备婚礼当天红包（改口费等）', completed: false, phase: '1周前', category: '财务' },
  { text: '美甲美发', completed: false, phase: '1周前', category: '个人' },
  { text: '打包婚礼当天物品', completed: false, phase: '1周前', category: '流程' },
  // 当天
  { text: '早起化妆换装', completed: false, phase: '当天', category: '流程' },
  { text: '接亲游戏', completed: false, phase: '当天', category: '流程' },
  { text: '迎宾', completed: false, phase: '当天', category: '流程' },
  { text: '婚礼仪式典礼', completed: false, phase: '当天', category: '流程' },
  { text: '敬酒', completed: false, phase: '当天', category: '流程' },
]

/** 简约婚礼模板 */
export const simpleTemplate: Omit<TodoItem, 'id'>[] = [
  { text: '确定婚期和预算', completed: false, phase: '6月前', category: '筹备' },
  { text: '预定婚宴场地', completed: false, phase: '6月前', category: '场地' },
  { text: '拍婚纱照', completed: false, phase: '6月前', category: '婚纱' },
  { text: '选购婚戒', completed: false, phase: '3月前', category: '珠宝' },
  { text: '确定宾客名单并发请帖', completed: false, phase: '3月前', category: '宾客' },
  { text: '预订婚车', completed: false, phase: '3月前', category: '婚车' },
  { text: '确定婚庆和四大金刚', completed: false, phase: '3月前', category: '婚庆' },
  { text: '确认宾客到场情况', completed: false, phase: '1月前', category: '宾客' },
  { text: '与酒店确认桌数菜单', completed: false, phase: '1月前', category: '场地' },
  { text: '准备喜糖和伴手礼', completed: false, phase: '1月前', category: '物品' },
  { text: '婚礼彩排', completed: false, phase: '1周前', category: '流程' },
  { text: '准备红包', completed: false, phase: '1周前', category: '财务' },
  { text: '接亲/仪式/敬酒', completed: false, phase: '当天', category: '流程' },
]

/** 旅行婚礼模板 */
export const travelTemplate: Omit<TodoItem, 'id'>[] = [
  { text: '确定旅行目的地和婚期', completed: false, phase: '6月前', category: '筹备' },
  { text: '预定机票酒店', completed: false, phase: '6月前', category: '场地' },
  { text: '办理签证（出境）', completed: false, phase: '6月前', category: '筹备' },
  { text: '选购婚纱（轻便款）', completed: false, phase: '3月前', category: '婚纱' },
  { text: '选购婚戒', completed: false, phase: '3月前', category: '珠宝' },
  { text: '预定当地婚礼策划/摄影师', completed: false, phase: '3月前', category: '婚庆' },
  { text: '确定宾客（仅核心亲友）', completed: false, phase: '1月前', category: '宾客' },
  { text: '整理婚礼当天物品', completed: false, phase: '1周前', category: '流程' },
  { text: '出发前往目的地', completed: false, phase: '1周前', category: '流程' },
]

/** 每日备婚小贴士 */
export const tips = [
  '婚宴酒店需提前 6-12 个月预定，热门日期（五一/十一）更需提前。',
  '婚纱照建议婚礼前 3-6 个月拍摄，留足后期时间。',
  '宾客名单先列"必请"再列"可请"，最后按预算筛选。',
  '婚车车队数量习俗：一般 6 辆或 8 辆（双数吉利），主婚车 1 辆加跟车。',
  '婚礼预算大头是婚宴（约 45%）和婚庆布置（约 15%），先定这两项。',
  '三金（金项链、金耳环、金戒指）传统上由男方购买，现代可双方商议。',
  '婚礼当天流程建议打印出来给每位伴郎伴娘各一份。',
  '喜糖数量 = 宾客人数 × 1.5，多备一些散糖给未到场的同事邻居。',
  '婚礼前一周尽量早睡，皮肤状态好上妆更服帖。',
  '雨天备选方案一定要有，户外婚礼务必准备 Plan B。',
]
