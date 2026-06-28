import { AppData } from '../types'

interface Props { data: AppData; onClose: () => void }

const lunarMonths = ['正','二','三','四','五','六','七','八','九','十','冬','腊']
const lunarDays = ['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十','廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十']

export default function Invitation({ data, onClose }: Props) {
  const { weddingInfo, milestones } = data
  const main = milestones?.find(m => m.name.includes('主婚')) || milestones?.[2]

  const lunarStr = main?.date ? (() => {
    const d = new Date(main.date)
    const ref = new Date('2026-01-29')
    const offset = Math.floor((d.getTime() - ref.getTime()) / 86400000)
    return `农历${lunarMonths[(d.getMonth() + 10) % 12]}月${lunarDays[Math.abs(offset % 30)]}`
  })() : ''

  const dateStr = main?.date ? new Date(main.date).toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
  }) : ''

  return (
    <div className="fixed inset-0 z-50 bg-bg overflow-auto">
      {/* 关闭 */}
      <button onClick={onClose} className="fixed top-5 right-5 z-10 w-9 h-9 rounded-full bg-surf flex items-center justify-center text-soft text-sm shadow-sm hover:bg-elev">✕</button>

      {/* 顶部装饰 */}
      <div className="h-1.5 bg-gradient-to-r from-transparent via-deepmauve/20 to-transparent" />

      <div className="max-w-md mx-auto px-6 py-12 text-center space-y-10">
        {/* Hero */}
        <div className="space-y-8 pt-8">
          <p className="text-sm text-mute tracking-[0.3em] font-serif">SAVE THE DATE</p>

          {/* 花饰分隔 */}
          <div className="flex items-center justify-center gap-3">
            <svg className="w-12 h-px text-warm/60" viewBox="0 0 48 1"><line x1="0" y1="0.5" x2="48" y2="0.5" stroke="currentColor"/></svg>
            <span className="text-2xl">🌸</span>
            <svg className="w-12 h-px text-warm/60" viewBox="0 0 48 1"><line x1="0" y1="0.5" x2="48" y2="0.5" stroke="currentColor"/></svg>
          </div>

          {/* 姓名 */}
          <div className="space-y-3">
            <p className="text-4xl font-serif text-ink tracking-[0.15em]">{weddingInfo.groomName || '新郎'}</p>
            <p className="text-6xl font-serif text-deepmauve font-extralight leading-none">&</p>
            <p className="text-4xl font-serif text-ink tracking-[0.15em]">{weddingInfo.brideName || '新娘'}</p>
          </div>
        </div>

        {/* 日期卡片 */}
        {dateStr && (
          <div className="bg-surf rounded-3xl px-8 py-8 border border-border space-y-5 shadow-sm">
            <div className="space-y-1">
              <p className="text-xs text-mute tracking-[0.2em]">谨 定 于</p>
              <p className="text-lg font-serif text-ink tracking-wider leading-relaxed">{dateStr}</p>
              {lunarStr && <p className="text-sm text-deepmauve/60 font-serif">{lunarStr}</p>}
            </div>

            <div className="h-px bg-border" />

            <div className="space-y-4 text-left">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-deepmauve/10 flex items-center justify-center text-xl shrink-0">🕐</div>
                <div>
                  <p className="text-xs text-mute">仪式</p>
                  <p className="text-sm font-medium text-ink">中午 12:08</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-sage/10 flex items-center justify-center text-xl shrink-0">📍</div>
                <div>
                  <p className="text-xs text-mute">地点</p>
                  <p className="text-sm font-medium text-ink">成都 · 犀浦/红光</p>
                  <div className="flex gap-2 mt-2">
                    {[
                      ['🗺️ 高德', 'https://uri.amap.com/navigation?to=103.99,30.76&mode=car&callnative=1'],
                      ['📍 百度', 'https://api.map.baidu.com/directions?destination=30.76,103.99&output=html'],
                      ['🍎 Apple', 'https://maps.apple.com/?q=30.76,103.99'],
                    ].map(([n, u]) => (
                      <a key={n} href={u}
                        className="flex-1 bg-surf hover:bg-border text-center text-xs py-2.5 rounded-xl font-medium text-soft hover:text-ink transition-colors">
                        {n}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 邀约语 */}
        <div className="space-y-4">
          <p className="text-sm text-soft leading-relaxed px-4">
            诚挚邀请您携家人一同见证
          </p>
          <p className="text-sm text-mute leading-relaxed px-4">
            这世间所有的美好，都不及此刻我们握住彼此的手
          </p>
        </div>

        {/* 底部 */}
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-px bg-border" />
            <span className="text-[10px] text-mute/80 tracking-[0.2em]">TOGETHER WITH THEIR FAMILIES</span>
            <div className="w-8 h-px bg-border" />
          </div>
          <p className="text-[10px] text-soft/20">何飞 & 蒋沁伶 · 2026</p>
        </div>
      </div>

      {/* 底部装饰 */}
      <div className="h-1.5 bg-gradient-to-r from-transparent via-deepmauve/20 to-transparent mb-8" />
    </div>
  )
}
