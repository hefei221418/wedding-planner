import { useState } from 'react'
import { Tab } from './types'
import { useStorage } from './hooks/useStorage'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import TodoList from './pages/TodoList'
import Budget from './pages/Budget'
import Guests from './pages/Guests'
import Cars from './pages/Cars'
import Settings from './pages/Settings'

export default function App() {
  const { data, update, reset, manualSync, manualUpload, toggleAutoSync, reconnect, autoSync, syncStatus, lastSyncTime, syncChange, dirtyCount, offlineChanges } = useStorage()
  const [tab, setTab] = useState<Tab>('dashboard')

  if (syncStatus === '加载中') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center"><div className="text-4xl animate-bounce mb-4">💒</div><p className="text-softink text-sm">正在加载…</p></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* 桌面端居中，移动端全宽 */}
      <div className="mx-auto w-full max-w-2xl lg:max-w-4xl xl:max-w-5xl flex-1 flex flex-col shadow-2xl">
        {offlineChanges && <div className="bg-amber-200 border-b border-amber-300 px-4 py-2 text-center text-sm text-amber-800 font-medium">⚠️ 离线改动 {dirtyCount} 项未同步</div>}
        {syncStatus === '离线' && <div className="bg-red-100 border-b border-red-200 px-4 py-2 text-center text-sm text-red-700 font-medium">🔴 已离线 — 数据保存在本地</div>}
        <div className="flex-1 overflow-auto pb-20 lg:pb-6">
          {tab === 'dashboard' && <Dashboard data={data} />}
          {tab === 'todos' && <TodoList data={data} update={update} />}
          {tab === 'budget' && <Budget data={data} update={update} />}
          {tab === 'guests' && <Guests data={data} update={update} />}
          {tab === 'cars' && <Cars data={data} update={update} />}
          {tab === 'settings' && <Settings data={data} update={update} reset={reset} manualSync={manualSync} manualUpload={manualUpload} toggleAutoSync={toggleAutoSync} reconnect={reconnect} autoSync={autoSync} syncStatus={syncStatus} lastSyncTime={lastSyncTime} syncChange={syncChange} dirtyCount={dirtyCount} offlineChanges={offlineChanges} />}
        </div>
        <Layout tab={tab} onTab={setTab} />
      </div>
    </div>
  )
}
