import { AppData } from '../types'

export const seedData: AppData = {
  weddingInfo: {
    groomName: '何飞',
    brideName: '蒋沁伶',
    weddingDate: '2026-12-26',
    totalBudget: 60000,
  },
  inviteCode: '520999',

  milestones: [
    { id: 'm1', name: '领结婚证', date: '2026-11-26', icon: '📝' },
    { id: 'm2', name: '送期（过大礼）', date: '2026-12-01', icon: '🎁' },
    { id: 'm3', name: '男方主婚场', date: '2026-12-26', icon: '💒' },
    { id: 'm4', name: '女方回门宴', date: '2027-01-12', icon: '🏠' },
  ],

  todos: [
    { id: 's1', text: '定婚期 — 冬月十八=12月26日周六', completed: true, phase: '12月前', category: '定方向' },
    { id: 's2', text: '定预算 — 总盘子约5-6万（不含彩礼三金）', completed: true, phase: '12月前', category: '定方向' },
    { id: 's3', text: '定酒店 — 犀浦/红光周边，14桌', completed: false, phase: '6月前', category: '场地' },
    { id: 's4', text: '定婚庆公司 — 看案例→套餐vs定制→签合同', completed: false, phase: '6月前', category: '婚庆' },
    { id: 's5', text: '定四大金刚 — 司仪+摄影+摄像+化妆师（须做过汉服造型）', completed: false, phase: '6月前', category: '婚庆' },
    { id: 's6', text: '拍婚纱照 — 美团已定1300套餐', completed: false, phase: '6月前', category: '婚纱' },
    { id: 's7', text: '选婚服（租赁）— 新娘3套+新郎1套，天赐华裳/重回汉唐', completed: false, phase: '3月前', category: '婚纱' },
    { id: 's8', text: '定婚车 — 头车+跟车，规划路线', completed: false, phase: '3月前', category: '婚车' },
    { id: 's9', text: '草拟宾客名单 — 双方各拉清单', completed: false, phase: '6月前', category: '宾客' },
    { id: 's10', text: '发请柬 — 电子请柬（朋友）+纸质（长辈）', completed: false, phase: '3月前', category: '宾客' },
    { id: 's11', text: '买婚戒 — 对戒一对，春熙路/IFS对比', completed: false, phase: '3月前', category: '珠宝' },
    { id: 's12', text: '买婚品 — 喜糖/红包/喜字/签到本/应急包（荷花池）', completed: false, phase: '1月前', category: '物品' },
    { id: 's13', text: '与婚庆沟通细节 — 流程表/音乐清单/布置图', completed: false, phase: '1月前', category: '婚庆' },
    { id: 's14', text: '试妆 — 带三套婚服做全套造型', completed: false, phase: '1月前', category: '婚纱' },
    { id: 's15', text: '安排外地亲友 — 广安宾客住宿+交通', completed: false, phase: '1月前', category: '宾客' },
    { id: 's16', text: '彩排 — 婚礼前1-2天全员走一遍', completed: false, phase: '1周前', category: '流程' },
    { id: 's17', text: '包红包 — 堵门200个+司机+伴郎伴娘+工作人员', completed: false, phase: '1周前', category: '财务' },
    { id: 's18', text: '布置婚房 — 喜字/气球/红色床品', completed: false, phase: '1周前', category: '物品' },
    { id: 's19', text: '最终核对 — 挨个电话确认所有供应商', completed: false, phase: '1周前', category: '流程' },
    { id: 's20', text: '清点礼金 — 拆红包登记', completed: false, phase: '当天', category: '财务' },
    { id: 's21', text: '归还租赁 — 婚服干洗归还', completed: false, phase: '当天', category: '物品' },
    { id: 's22', text: '等成品 — 摄影摄像1-3个月出片', completed: false, phase: '12月前', category: '婚庆' },
  ],

  budgetCategories: [
    { key: 'venue', name: '婚宴酒席', budget: 31800, spent: 0, color: '#C98B8B', ratio: 45 },
    { key: 'dress', name: '婚纱礼服', budget: 2300, spent: 0, color: '#B8956A', ratio: 10 },
    { key: 'decoration', name: '婚庆布置', budget: 18000, spent: 0, color: '#9B8AB5', ratio: 15 },
    { key: 'photo', name: '摄影摄像', budget: 1300, spent: 0, color: '#7A9372', ratio: 8 },
    { key: 'jewelry', name: '珠宝首饰', budget: 8000, spent: 0, color: '#D4A87C', ratio: 10 },
    { key: 'car', name: '婚车', budget: 3000, spent: 0, color: '#A895B8', ratio: 5 },
    { key: 'other', name: '其他（婚品+住宿+杂项）', budget: 9600, spent: 0, color: '#8A8A8A', ratio: 7 },
  ],

  expenses: [],

  // ✅ 新模型：分组+联系人+预计vs确认
  guests: [
    // 沁伶方（广安）
    { id: 'g1', name: '蒋阿姨家（山上）', contact: '蒋阿姨', phone: '', estimated: 8, confirmed: 0, side: '女方', relation: '亲戚', rsvp: '待确认', giftAmount: 0, note: '' },
    { id: 'g2', name: '蒋涛、蒋德菊家', contact: '蒋涛', phone: '', estimated: 7, confirmed: 0, side: '女方', relation: '亲戚', rsvp: '待确认', giftAmount: 0, note: '' },
    { id: 'g3', name: '罗强家', contact: '罗强', phone: '', estimated: 20, confirmed: 0, side: '女方', relation: '亲戚', rsvp: '待确认', giftAmount: 0, note: '' },
    { id: 'g4', name: '张迁、曼琳', contact: '张迁', phone: '', estimated: 4, confirmed: 0, side: '女方', relation: '亲戚', rsvp: '待确认', giftAmount: 0, note: '' },
    { id: 'g5', name: '宋金成', contact: '宋金成', phone: '', estimated: 2, confirmed: 0, side: '女方', relation: '亲戚', rsvp: '待确认', giftAmount: 0, note: '' },
    { id: 'g6', name: '朋友（沁伶）', contact: '', phone: '', estimated: 6, confirmed: 0, side: '女方', relation: '朋友', rsvp: '待确认', giftAmount: 0, note: '' },
    // 何飞方
    { id: 'g7', name: '父亲这边亲戚', contact: '', phone: '', estimated: 10, confirmed: 0, side: '男方', relation: '亲戚', rsvp: '待确认', giftAmount: 0, note: '' },
    { id: 'g8', name: '母亲这边亲戚', contact: '', phone: '', estimated: 30, confirmed: 0, side: '男方', relation: '亲戚', rsvp: '待确认', giftAmount: 0, note: '' },
    { id: 'g9', name: '二哥这边', contact: '二哥', phone: '', estimated: 20, confirmed: 0, side: '男方', relation: '亲戚', rsvp: '待确认', giftAmount: 0, note: '' },
    { id: 'g10', name: '朋友（何飞）', contact: '', phone: '', estimated: 10, confirmed: 0, side: '男方', relation: '朋友', rsvp: '待确认', giftAmount: 0, note: '李智+叶泉+小龙+刘越+室友等' },
  ],

  cars: [],
}
