import { useState, useEffect } from 'react'
import { Tab } from './types'
import { useStorage } from './hooks/useStorage'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import TodoList from './pages/TodoList'
import Budget from './pages/Budget'
import Guests from './pages/Guests'
import Cars from './pages/Cars'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Invitation from './pages/Invitation'

export default function App() {
  const { data, update, reset, status, lastSync, editingRef, refresh } = useStorage()
  const [tab, setTab] = useState<Tab>('dashboard')

  useEffect(() => { refresh() }, [tab])
  const [showInvite, setShowInvite] = useState(window.location.search.includes('invite'))
  const [loggedIn, setLoggedIn] = useState(() => {
    const ts = localStorage.getItem('wd_logged_in')
    if (!ts) return false
    return Date.now() - Number(ts) < 7 * 24 * 60 * 60 * 1000
  })

  if (showInvite) return <Invitation data={data} onClose={() => { setShowInvite(false); history.length > 1 ? history.back() : window.location.replace('/') }} />
  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <div className="mx-auto w-full max-w-2xl lg:max-w-4xl xl:max-w-5xl flex-1 flex flex-col shadow-2xl">
        {status === '离线' && <div className="bg-red/20 border-b border-red/30 px-4 py-1.5 text-center text-xs text-red">🔴 已离线</div>}
        <div className="flex-1 overflow-auto pb-20 lg:pb-6">
          <div key={tab} className="animate-[fadeIn_0.15s_ease-out]">
            {tab === 'dashboard' && <Dashboard data={data} onInvite={() => setShowInvite(true)} onNav={(t) => setTab(t as Tab)} />}
            {tab === 'todos' && <TodoList data={data} update={update} />}
            {tab === 'budget' && <Budget data={data} update={update} />}
            {tab === 'guests' && <Guests data={data} update={update} />}
            {tab === 'cars' && <Cars data={data} update={update} />}
            {tab === 'settings' && <Settings data={data} update={update} reset={reset} status={status} lastSync={lastSync} editingRef={editingRef} />}
          </div>
        </div>
        <Layout tab={tab} onTab={setTab} />
      </div>
    </div>
  )
}
