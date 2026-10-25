import { Play, MoreVertical } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Video } from '@/types'
import { exactUploadTime, timeAgo } from '@/utils/timeAgo'

export function VideoCard({ video }: { video: Video }) {
  return <article className="min-w-0">
    <Link to={`/watch?v=${video.id}`} className="group block">
      <div className="relative aspect-video overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-800">
        <img src={video.thumbnail} alt="" className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
        <span className={`absolute bottom-2 right-2 rounded px-1.5 py-0.5 text-xs font-semibold text-white ${video.live ? 'bg-red-600' : 'bg-black/85'}`}>{video.live ? 'LIVE' : video.duration}</span>
      </div>
      <div className="mt-3 flex gap-3">
        {video.avatar ? <img src={video.avatar} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" /> : <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-red-600 text-xs font-bold text-white">{video.channel.slice(0, 1)}</span>}
        <div className="min-w-0 flex-1"><h2 className="line-clamp-2 font-semibold leading-5">{video.title}</h2><p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{video.channel}</p><p title={`Uploaded ${exactUploadTime(video.publishedAt)}`} className="text-sm text-zinc-600 dark:text-zinc-400">{video.views} · {timeAgo(video.publishedAt)}</p></div>
        <button aria-label="Video options" className="h-8"><MoreVertical className="h-5 w-5" /></button>
      </div>
    </Link>
  </article>
}

export function VideoGrid({ items, loading = false }: { items: Video[]; loading?: boolean }) {
  if (loading) return <div className="video-grid">{Array.from({ length: 10 }, (_, index) => <div key={index} className="animate-pulse"><div className="aspect-video rounded-lg bg-zinc-200 dark:bg-zinc-800" /><div className="mt-3 flex gap-3"><div className="h-9 w-9 rounded-full bg-zinc-200 dark:bg-zinc-800" /><div className="flex-1 space-y-2"><div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" /><div className="h-4 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" /></div></div></div>)}</div>
  if (!items.length) return <div className="grid min-h-[50vh] place-items-center text-center"><div><PlayIcon /><h1 className="mt-3 text-xl font-semibold">No videos here yet</h1><p className="mt-1 text-sm text-zinc-500">Check back soon for something new.</p></div></div>
  return <div className="video-grid">{items.map((video) => <VideoCard key={video.id} video={video} />)}</div>
}

function PlayIcon() { return <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red-600 text-white"><Play className="h-6 w-6 fill-current" /></span> }
