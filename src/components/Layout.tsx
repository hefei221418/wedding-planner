import { Tab } from '../types'
interface Props { tab: Tab; onTab: (t: Tab) => void }

const tabs: { key: Tab; label: string; icon: string }[] = [
  { key: 'dashboard', label: '总览', icon: '🏠' },
  { key: 'todos', label: '待办', icon: '📋' },
  { key: 'budget', label: '预算', icon: '💰' },
  { key: 'guests', label: '宾客', icon: '👥' },
  { key: 'cars', label: '婚车', icon: '🚗' },
  { key: 'settings', label: '设置', icon: '⚙️' },
]

export default function Layout({ tab, onTab }: Props) {
  return (
    // 移动端底部固定，桌面端顶部侧边栏
    <nav className="fixed bottom-0 left-0 right-0 bg-bg/80 backdrop-blur-lg border-t border-border flex justify-around py-1.5 safe-bottom z-40
      lg:fixed lg:left-0 lg:top-0 lg:right-auto lg:bottom-0 lg:w-20 lg:flex lg:flex-col lg:justify-center lg:gap-4 lg:bg-bg/80 lg:backdrop-blur-lg lg:border-r lg:border-t-0">
      {tabs.map(t => (
        <button key={t.key} onClick={() => onTab(t.key)}
          className={`flex flex-col items-center px-2 py-1 lg:py-3 rounded-xl text-xs lg:text-sm transition-all
            ${tab === t.key ? 'text-deepmauve font-bold' : 'text-mute hover:text-deepmauve'}`}
        >
          <span className="text-lg lg:text-2xl">{t.icon}</span>
          <span className="mt-0.5">{t.label}</span>
          {tab === t.key && <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-deepmauve rounded-full" />}
        </button>
      ))}
    </nav>
  )
}
