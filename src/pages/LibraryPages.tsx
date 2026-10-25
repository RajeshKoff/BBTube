import { Search } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { videos } from '@/data'
import { VideoGrid } from '@/components/VideoCard'
import { useAppStore } from '@/store/useAppStore'

export function LibraryPage({ mode }: { mode: 'History' | 'Liked' | 'Watch later' | 'Playlists' }) {
  const store = useAppStore(); const items = mode === 'History' ? store.history : mode === 'Liked' ? store.liked : store.watchLater
  if (mode === 'Playlists') return <div className="p-4 md:p-6"><h1 className="mb-5 text-2xl font-bold">Playlists</h1><div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800"><h2 className="font-semibold">Your playlists</h2><p className="mt-1 text-sm text-zinc-500">Saved playlists will appear here.</p></div></div>
  return <div className="p-4 md:p-6"><h1 className="mb-5 text-2xl font-bold">{mode}</h1>{mode === 'History' && <div className="mb-5 flex flex-wrap items-center gap-3"><input aria-label="Search history" placeholder="Search watch history" className="w-full max-w-md rounded-full border border-zinc-300 bg-transparent px-4 py-2" /><button onClick={store.clearHistory} className="text-sm font-semibold text-blue-600">Clear all watch history</button></div>}<VideoGrid items={items} /></div>
}

export function SubscriptionsPage() { const store = useAppStore(); const items = videos.filter((video) => store.subscriptions.includes(video.channelId)); return <div className="p-4 md:p-6"><h1 className="mb-5 text-2xl font-bold">Subscriptions</h1>{items.length ? <VideoGrid items={items} /> : <div className="grid min-h-[55vh] place-items-center text-center"><div><Search className="mx-auto h-12 w-12 text-zinc-400" /><p className="mt-4 font-semibold">No subscription updates yet</p><p className="mt-1 text-sm text-zinc-500">Subscribe to a channel to add its videos here.</p></div></div>}</div> }

export function ChannelPage() {
  const { id } = useParams(); const channel = videos.find((video) => video.channelId === id) ?? videos[0]
  return <div><div className="h-36 bg-gradient-to-r from-sky-900 via-zinc-800 to-amber-800 md:h-52" /><div className="mx-auto max-w-6xl px-4"><div className="flex items-center gap-5 py-5"><img src={channel.avatar} alt="" className="h-20 w-20 rounded-full md:h-24 md:w-24" /><div><h1 className="text-xl font-bold md:text-3xl">{channel.channel}</h1><p className="text-sm text-zinc-500">@{channel.channelId} · 1.2M subscribers</p></div></div><div className="flex gap-6 overflow-x-auto border-b border-zinc-200 text-sm dark:border-zinc-800">{['Home', 'Videos', 'Shorts', 'Live', 'Playlists', 'About'].map((tab, index) => <button key={tab} className={`border-b-2 px-1 py-3 font-semibold ${index === 0 ? 'border-red-600' : 'border-transparent'}`}>{tab}</button>)}</div><div className="py-5"><VideoGrid items={videos.filter((video) => video.channelId === channel.channelId || video.channelId !== channel.channelId).slice(0, 7)} /></div></div></div>
}

export function SettingsPage() {
  const store = useAppStore()
  return <div className="mx-auto max-w-2xl p-6"><h1 className="text-2xl font-bold">Settings</h1><div className="mt-6 divide-y divide-zinc-200 dark:divide-zinc-800"><Setting label="Dark theme" control={<input aria-label="Dark theme" type="checkbox" checked={store.theme === 'dark'} onChange={store.toggleTheme} />} /><Setting label="Region" control={<select aria-label="Region" value={store.region} onChange={(event) => store.setRegion(event.target.value)} className="rounded border border-zinc-300 bg-white p-2 dark:bg-zinc-900"><option>US</option><option>GB</option><option>CA</option><option>JP</option></select>} /><Setting label="Language" control={<select aria-label="Language" value={store.language} onChange={(event) => store.setLanguage(event.target.value)} className="rounded border border-zinc-300 bg-white p-2 dark:bg-zinc-900"><option value="en">English</option><option value="es">Spanish</option><option value="fr">French</option></select>} /><button onClick={store.reset} className="mt-5 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white">Clear all BBTube data</button></div></div>
}
function Setting({ label, control }: { label: string; control: React.ReactNode }) { return <div className="flex items-center justify-between py-4"><span className="font-semibold">{label}</span>{control}</div> }
