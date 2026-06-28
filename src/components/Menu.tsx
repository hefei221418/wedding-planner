import { useState, useRef, useEffect } from 'react'

interface Props {
  items: { label: string; onClick: () => void; danger?: boolean }[]
}

export default function Menu({ items }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    if (open) document.addEventListener('click', h)
    return () => document.removeEventListener('click', h)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button onClick={e => { e.stopPropagation(); setOpen(!open) }}
        className="text-mute hover:text-ink text-lg px-2 py-1 leading-none">⋯</button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-elev border border-border rounded-xl py-1 shadow-lg z-10 min-w-[80px]">
          {items.map((item, i) => (
            <button key={i} onClick={e => { e.stopPropagation(); item.onClick(); setOpen(false) }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-surf transition-colors ${item.danger ? 'text-red' : 'text-soft'}`}>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
