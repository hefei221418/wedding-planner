# 婚礼筹备助手 — 设计文档

## 配色系统

```
主题：暖调深色
背景：#1B1918 (bg)   卡片：#242221 (surf)   弹窗：#302D2C (elev)   边框：#3A3634 (border)
主文：#EDE9E3 (ink)   次要：#9A9490 (soft)   最淡：#6B6662 (mute)
主色：#C9A9A9 (mauve) 强调：#A87E7E (deepmauve) 成功：#8A9E85 (sage) 待定：#C4A882 (amber) 错误：#C47A7A (red)
```

**配色规则：**
- 文字深底浅字、浅底深字，对比度≥4.5:1
- 主色 mauve 用于筛选/标签/请柬入口
- sage 用于已确认/成功状态
- amber 用于待确认/离线提示
- red 用于删除/失败状态

## 布局

```
移动端(<lg): 底部Tab导航 + 全宽内容 + 浮动按钮
桌面端(≥lg): 左侧竖排Tab(80px宽) + 内容居中(max-w-4xl)
弹窗: 移动端底部弹出(bottom-sheet) / 桌面端居中(modal)
```

## 组件规范

### 底部导航 `Layout.tsx`
- 6个tab：总览/待办/预算/宾客/婚车/设置
- 选中态：mauve色文字 + 底部4px圆点指示条
- 背景毛玻璃 `bg-bg/80 backdrop-blur-lg`

### 浮动按钮 FAB
- 位置：`fixed bottom-24 right-4`
- 样式：圆形56px 深底浅字 `bg-ink text-bg`
- 页面映射：待办→添加弹窗 / 预算→记账弹窗 / 宾客→表单弹窗 / 婚车→表单弹窗

### 卡片
- 基础：`bg-surf rounded-2xl p-4 border border-border`
- 悬停：`hover:bg-surf`
- 紧凑版：`rounded-xl px-3 py-2`

### 进度环 `ProgressRing.tsx`
- 尺寸76px 环厚4px
- 底色圈：`stroke="#3A3634"`
- 彩圈：按label名hash取4色(mauve/sage/gold/purple)
- 动画：`stroke-dashoffset 0.8s ease`

### 倒计时 `Countdown.tsx`
- 大数字：`text-8xl font-serif text-ink`
- 名字行：`text-deepmauve font-serif tracking-widest`
- 日期行：`text-soft`

### 空状态
- 统一：大图标(5xl)+ 引导文案(text-soft/mute)
- 示例：`🚗 点击 ＋ 添加婚车`

### Toast
- 位置：`fixed top-4 center`
- 样式：深底白字圆角 `bg-ink/90 rounded-full`
- 动画：`fadeIn 0.2s` 自动消失2.5s

### 弹窗
- 遮罩：`bg-black/50`
- 面板：`bg-elev rounded-t-3xl sm:rounded-3xl`
- 表单区：输入框`bg-border` 圆角`rounded-xl`
- 按钮组：取消`bg-border text-soft` + 确认`bg-ink text-bg`

## 页面详情

### 总览 `Dashboard`
- 倒计时区→里程碑卡(4列)→进度环(4列，可点击跳转)→请柬入口→小贴士→到场/桌数(可点击跳转)
- 里程碑卡：14天内飘红 已过变绿✓ 正常显示天数

### 待办 `TodoList`
- 进度条→模板导入(空数据时)→筛选标签→列表→浮动添加按钮→弹窗表单
- 勾选：黑底白勾`bg-ink border-ink`
- 完成项：删除线`line-through text-mute`
- 阶段标签：6色(12月前sage/6月前mauve/3月前amber/1月前orange/1周前red/当天deepmauve)

### 预算 `Budget`
- 三数字(总/花/剩)→饼图(支出占比条)→分类预算(可修改弹窗)→支出记录→浮动记账按钮→两个弹窗
- 分类预算弹窗可增删分类
- 支出记录有删除按钮

### 宾客 `Guests`
- 四数字(组数/到场/桌数/礼金)→确认进度条→筛选(全部/男方/女方)→卡片列表→浮动添加→弹窗表单
- 卡片：组名+方标签+关系+联系人+预计/确认人数+礼金+RSVP三按钮(待确认灰色/已确认绿色/已拒绝灰色)+备注
- 表单包含：方/关系/组名/联系人/电话/预计/确认/礼金/备注

### 婚车 `Cars`
- 车队列表→浮动添加→弹窗表单
- 卡片：类型标签+车牌+司机+电话+乘客+路线
- 表单：类型/车牌/司机/电话/乘客/出发地/目的地

### 设置 `Settings`
- 云端同步状态区(版本+时间+下载/上传按钮+自动开关)
- 基本信息(新郎/新娘/婚期/预算)→保存成功按钮变绿2秒
- 关键日期(图标+名称+倒计时+日期选择器+阳历格式)
- 数据导出(Excel/宾客表/备份)→导入折叠区
- 重置按钮

### 请柬 `Invitation`
- 独立页面 `?invite=1` 无需登录
- 顶部装饰线→SAVE THE DATE→花饰分隔→双名+&→日期卡片(白底+农历+阳历)→时间地点→内嵌OpenStreetMap+三个地图按钮→邀约语→底部署名
- 关闭按钮右上角
- 地图按钮：高德/百度/Apple 三个胶囊

### 登录 `Login`
- 中性背景+圆点纹+双色光圈
- 头像emoji+标题+署名+用户名密码输入+登录按钮
- 7天免登录(登录时间戳记localStorage)

## 同步机制

**数据流：** 浏览器→`/api/data`(Vercel Serverless)→Upstash Redis
**存储：** Upstash免费额度 256MB/6万读/3千写每天
**本地：** localStorage实时备份 + 版本号防覆盖
**策略：** 修改即上传(PUT) + 8秒轮询(GET) + 离线15秒重试 + 标签页切回立即同步 + 冲突时合并(保留双方增量)
**版本：** 本地版号>远程→推送本地 远程≥本地→拉取远程

## 字体

- 正文：`PingFang SC / Noto Sans SC / Microsoft YaHei`
- 装饰：`Noto Serif SC / SimSun` (数字、姓名字段)
- 圆角：统一14/18/24px三档

## 文件结构

```
src/
├── types.ts          # 全部类型定义
├── store.ts          # localStorage读写 + 导出
├── nutstore.ts       # 数据同步接口
├── App.tsx           # 路由/登录/页面切换
├── index.css         # 全局样式+动画
├── data/
│   ├── seed.ts       # 预设数据(何飞&蒋沁伶)
│   ├── templates.ts  # 待办模板+小贴士
│   └── defaults.ts   # 默认预算分类
├── hooks/
│   └── useStorage.ts # 全局状态+同步逻辑
├── components/
│   ├── Layout.tsx    # 底部Tab导航
│   ├── Countdown.tsx # 倒计时组件
│   └── ProgressRing.tsx # 环形进度
└── pages/
    ├── Dashboard.tsx  # 总览
    ├── TodoList.tsx   # 待办
    ├── Budget.tsx     # 预算
    ├── Guests.tsx     # 宾客
    ├── Cars.tsx       # 婚车
    ├── Settings.tsx   # 设置
    ├── Login.tsx      # 登录
    └── Invitation.tsx # 请柬
```
