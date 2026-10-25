import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { videos } from '@/data'
import { VideoGrid } from '@/components/VideoCard'
import { getVideo, searchVideos } from '@/api/youtube.service'
import type { Video } from '@/types'

const homeTopics = [
  { label: 'All Bigg Boss 10', query: 'Bigg Boss Tamil Season 10 Vijay Television' },
  { label: 'Live', query: 'Bigg Boss Tamil Season 10 live Vijay Television' },
  { label: 'Promos', query: 'Bigg Boss Tamil Season 10 promo Vijay Television official' },
  { label: 'Latest', query: 'Bigg Boss Tamil 10 latest episode Vijay Television' },
  { label: 'Votes', query: '', external: true },
]

export function HomePage() {
  const [topic, setTopic] = useState('All Bigg Boss 10')
  const selected = homeTopics.find((item) => item.label === topic) ?? homeTopics[0]
  const feed = useQuery({
    queryKey: ['home-feed', topic],
    queryFn: async () => {
      const isLive = topic === 'Live'
      const liveQueries = [
        'Bigg Boss Tamil Season 10 live Vijay Television official',
        'Bigg Boss Tamil 10 24/7 live',
        'Vijay Television Bigg Boss 10 live today',
      ]
      const [pages, directLive] = await Promise.all([
        Promise.all((isLive ? liveQueries : [selected.query]).map((query) => searchVideos(query, undefined, isLive))),
        isLive ? getVideo('uFNLqEkZb-E').catch(() => null) : Promise.resolve(null),
      ])
      const unique = new Map<string, Video>()
      if (directLive) unique.set(directLive.id, directLive)
      const liveMatches = pages.flatMap((page) => page.items)
        .filter((video) => {
          if (!isLive) return /bigg boss|biggboss/i.test(`${video.title} ${video.description ?? ''}`)
          const text = `${video.title} ${video.description ?? ''}`.toLowerCase()
          return text.includes('bigg boss') || text.includes('biggboss') || text.includes('vijay television') || text.includes('bb tamil') || text.includes('big boss tamil')
        })
      liveMatches.forEach((video) => unique.set(video.id, video))
      return [...unique.values()]
    },
    enabled: !selected.external,
    staleTime: 10 * 60 * 1000,
  })
  if (selected.external) return <div className="md:h-[calc(100dvh-4rem)] md:overflow-hidden"><div className="chips-row"><button className="chip-arrow" aria-label="Scroll categories left"><ChevronLeft /></button><div className="chips-scroll">{homeTopics.map((item) => <button key={item.label} onClick={() => setTopic(item.label)} className={`chip ${item.label === topic ? 'chip-active' : ''}`}>{item.label}</button>)}</div><button className="chip-arrow" aria-label="Scroll categories right"><ChevronRight /></button></div><div className="bg-white md:h-[calc(100dvh-8rem)] md:overflow-y-auto md:overscroll-contain"><iframe title="Bigg Boss Tamil Vote" src="https://tamilglitz.in/bigg-boss-tamil-vote/" scrolling="yes" className="pointer-events-auto block h-[4200px] w-full touch-manipulation border-0 md:h-full" allow="fullscreen; clipboard-read; clipboard-write" /></div></div>
  if (feed.isError) return <div className="grid min-h-[55vh] place-items-center text-center"><div><h1 className="text-xl font-semibold">Home videos could not be loaded</h1><p className="mt-2 text-sm text-zinc-500">{feed.error instanceof Error ? feed.error.message : 'Check your YouTube API settings.'}</p><button onClick={() => feed.refetch()} className="mt-4 rounded-full bg-red-600 px-5 py-2 font-semibold text-white">Retry</button></div></div>
  return <div>
    <div className="chips-row"><button className="chip-arrow" aria-label="Scroll categories left"><ChevronLeft /></button><div className="chips-scroll">{homeTopics.map((item) => <button key={item.label} onClick={() => setTopic(item.label)} className={`chip ${item.label === topic ? 'chip-active' : ''}`}>{item.label}</button>)}</div><button className="chip-arrow" aria-label="Scroll categories right"><ChevronRight /></button></div>
    <div className="p-4 md:p-6"><VideoGrid items={feed.data ?? []} loading={feed.isLoading} /></div>
  </div>
}

export function SearchPage() {
  const [params] = useSearchParams(); const query = params.get('search_query')?.trim() ?? ''; const [type, setType] = useState('Video')
  const result = useQuery({ queryKey: ['search', query], queryFn: () => searchVideos(query), enabled: Boolean(query), staleTime: 10 * 60 * 1000 })
  if (result.isError) return <div className="grid min-h-[55vh] place-items-center text-center"><div><h1 className="text-xl font-semibold">Videos could not be loaded</h1><p className="mt-2 text-sm text-zinc-500">{result.error instanceof Error ? result.error.message : 'Check your YouTube API key and restrictions.'}</p><button onClick={() => result.refetch()} className="mt-4 rounded-full bg-red-600 px-5 py-2 font-semibold text-white">Retry</button></div></div>
  return <div className="mx-auto max-w-6xl p-4 md:p-6"><div className="mb-5 flex gap-2 overflow-x-auto">{['Video', 'Channel', 'Playlist', 'Live'].map((item) => <button key={item} onClick={() => setType(item)} className={`chip ${item === type ? 'chip-active' : ''}`}>{item}</button>)}</div><h1 className="mb-5 text-xl font-semibold">Results for “{query || 'all videos'}”</h1><VideoGrid items={result.data?.items ?? []} loading={result.isLoading} /></div>
}

export function FeedPage() { const [params] = useSearchParams(); const category = params.get('category') ?? 'Now'; return <div className="p-4 md:p-6"><h1 className="mb-5 text-2xl font-bold">{category}</h1><VideoGrid items={videos} /></div> }
export function LivePage() { const [mode, setMode] = useState<'Live'|'Upcoming'>('Live'); return <div className="p-4 md:p-6"><h1 className="mb-5 text-2xl font-bold">Live</h1><div className="mb-5 flex gap-2"><button onClick={() => setMode('Live')} className={`chip ${mode === 'Live' ? 'chip-active' : ''}`}>Live now</button><button onClick={() => setMode('Upcoming')} className={`chip ${mode === 'Upcoming' ? 'chip-active' : ''}`}>Upcoming</button></div>{mode === 'Live' ? <VideoGrid items={videos.filter((video) => video.live)} /> : <div className="rounded-lg border border-zinc-200 py-16 text-center dark:border-zinc-800">No upcoming streams</div>}</div> }
export function ShortsPage() { return <div className="mx-auto h-[calc(100vh-4rem)] max-w-md snap-y snap-mandatory overflow-y-auto bg-zinc-950">{videos.slice(0, 6).map((video, index) => <section key={video.id} className="relative h-full snap-start"><img src={video.thumbnail} alt="" className="h-full w-full object-cover opacity-90" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 p-5 text-white"><Link to={`/channel/${video.channelId}`} className="font-semibold">@{video.channel}</Link><p className="mt-2 text-sm">{video.title}</p><p className="mt-2 text-xs text-white/70">Short {index + 1} of 6</p></div></section>)}</div> }
export function PlaylistPage() { return <div className="p-4 md:p-6"><div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[320px_1fr]"><aside className="rounded-lg bg-gradient-to-b from-zinc-700 to-zinc-950 p-5 text-white"><h1 className="text-2xl font-bold">BBTube Mix</h1><p className="mt-2 text-sm">A curated collection</p><button className="mt-5 rounded-full bg-white px-5 py-2 font-semibold text-black">Play all</button></aside><div>{videos.slice(0, 8).map((video: Video, index: number) => <Link key={video.id} to={`/watch?v=${video.id}`} className="flex gap-3 rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900"><span className="w-6 pt-10 text-center text-sm text-zinc-500">{index + 1}</span><img src={video.thumbnail} alt="" className="w-40 rounded-lg object-cover" /><div><h2 className="font-semibold">{video.title}</h2><p className="mt-1 text-sm text-zinc-500">{video.channel}</p></div></Link>)}</div></div></div> }
