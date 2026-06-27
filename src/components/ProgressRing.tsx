interface Props { percent: number; label: string; sub?: string; color?: string }
const colors = ['#8B3A3A', '#5C7A5A', '#8B6914', '#6B5B7A']

export default function ProgressRing({ percent, label, sub, color }: Props) {
  const r = 28; const c = 2 * Math.PI * r; const offset = c - (Math.min(percent, 100) / 100) * c
  const idx = label.split('').reduce((a, ch) => a + ch.charCodeAt(0), 0) % colors.length
  const stroke = color || colors[idx]

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={76} height={76} className="transform -rotate-90">
        <circle cx={38} cy={38} r={r} fill="none" stroke="#E5E0DA" strokeWidth="4" />
        <circle cx={38} cy={38} r={r} fill="none" stroke={stroke} strokeWidth="4"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }} />
      </svg>
      <span className="text-xs font-semibold text-softink">{label}</span>
      {sub && <span className="text-[10px] text-softink/70">{sub}</span>}
    </div>
  )
}
