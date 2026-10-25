import { Outlet, NavLink } from 'react-router-dom'
import { History, Home, Play } from 'lucide-react'

export function Layout() {
  document.documentElement.className = 'dark'

  return <div className="min-h-screen bg-[#0f0f0f] pb-16 text-zinc-100 md:pb-0">
    <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-[#0f0f0f]">
      <NavLink to="/" aria-label="BBTube home" className="flex items-center gap-2 text-xl font-bold"><span className="grid h-7 w-9 place-items-center rounded-md bg-red-600 text-white"><Play className="h-4 w-4 fill-current" /></span>BBTube</NavLink>
    </header>
    <aside className="fixed bottom-0 left-0 top-16 z-40 hidden w-[180px] border-r border-zinc-200 bg-white px-3 py-4 dark:border-zinc-800 dark:bg-[#0f0f0f] md:block">
      <nav className="space-y-1"><DesktopLink to="/" label="Home" icon={<Home className="h-5 w-5" />} /><DesktopLink to="/feed/history" label="History" icon={<History className="h-5 w-5" />} /></nav>
    </aside>
    <main className="min-h-screen pt-16 md:pl-[180px]"><Outlet /></main>
    <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-50 grid h-16 grid-cols-2 border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-[#0f0f0f] md:hidden">
      <MobileLink to="/" label="Home" icon={<Home />} /><MobileLink to="/feed/history" label="History" icon={<History />} />
    </nav>
  </div>
}

function DesktopLink({ to, label, icon }: { to: string; label: string; icon: React.ReactNode }) {
  return <NavLink to={to} className={({ isActive }) => `flex items-center gap-4 rounded-lg px-3 py-3 text-sm ${isActive ? 'bg-zinc-100 font-semibold dark:bg-zinc-800' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>{icon}{label}</NavLink>
}

function MobileLink({ to, label, icon }: { to: string; label: string; icon: React.ReactNode }) {
  return <NavLink to={to} className={({ isActive }) => `flex flex-col items-center justify-center gap-1 text-xs ${isActive ? 'font-semibold text-red-600' : 'text-zinc-500 dark:text-zinc-400'}`}><span className="[&>svg]:h-5 [&>svg]:w-5">{icon}</span>{label}</NavLink>
}
