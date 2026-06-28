import { useMemo } from 'react'
interface Props { weddingDate: string; brideName?: string; groomName?: string }

export default function Countdown({ weddingDate, brideName, groomName }: Props) {
  const cd = useMemo(() => {
    if (!weddingDate) return null
    const d = new Date(weddingDate).getTime()
    if (isNaN(d)) return null
    const diff = d - Date.now()
    if (diff <= 0) return { days: 0, label: '🎉 新婚快乐！', passed: true }
    return { days: Math.ceil(diff / 86400000), label: '距离婚礼还有', passed: false }
  }, [weddingDate])

  if (!weddingDate) return <div className="text-center py-10"><p className="text-5xl mb-3">💒</p><p className="text-soft text-sm">在「设置」中设定婚礼日期</p></div>

  return (
    <div className="text-center py-8">
      {(brideName || groomName) && (
        <p className="font-serif text-deepmauve text-lg tracking-widest mb-3">{groomName}  ❤️  {brideName}</p>
      )}
      <div className="font-serif text-8xl font-light text-ink mb-2">{cd?.days ?? '--'}</div>
      <p className="text-soft text-base mb-3">{cd?.label}</p>
      <p className="text-soft text-sm">{new Date(weddingDate).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</p>
    </div>
  )
}
