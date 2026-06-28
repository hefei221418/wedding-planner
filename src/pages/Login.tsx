import { useState } from 'react'

interface Props { onLogin: () => void }

export default function Login({ onLogin }: Props) {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')

  const handleLogin = () => {
    if (user === '2214181104' && pass === 'hefei') {
      localStorage.setItem('wd_logged_in', String(Date.now()))
      onLogin()
    } else {
      setErr('用户名或密码错误')
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-5 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #8B3A3A 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-rose/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-sage/10 rounded-full blur-3xl" />

      <div className="w-full max-w-sm space-y-6 relative z-10">
        <div className="text-center">
          <p className="text-6xl mb-4">💒</p>
          <p className="text-2xl font-serif text-ink tracking-wider">婚礼筹备助手</p>
          <p className="text-xs text-mute mt-2">何飞 ❤️ 蒋沁伶</p>
        </div>

        <div className="bg-surf rounded-2xl p-6 space-y-4 border border-border shadow-lg">
          <input
            type="text"
            placeholder="用户名"
            value={user}
            onChange={e => setUser(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="w-full bg-border border-0 rounded-xl px-4 py-3 text-sm text-ink"
          />
          <input
            type="password"
            placeholder="密码"
            value={pass}
            onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="w-full bg-border border-0 rounded-xl px-4 py-3 text-sm text-ink"
          />
          {err && <p className="text-red text-sm text-center">{err}</p>}
          <button
            onClick={handleLogin}
            className="w-full bg-ink text-bg py-3 rounded-xl text-sm font-medium hover:bg-softink transition-colors"
          >
            登录
          </button>
        </div>
      </div>
    </div>
  )
}
