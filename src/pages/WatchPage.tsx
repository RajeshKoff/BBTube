import { Check, ListPlus, Share2, ThumbsDown, ThumbsUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import YouTube from 'react-youtube'
import { videos } from '@/data'
import { getVideo } from '@/api/youtube.service'
import { useAppStore } from '@/store/useAppStore'

export function WatchPage() {
  const [params] = useSearchParams()
  const id = params.get('v')?.trim() ?? ''
  const result = useQuery({
    queryKey: ['player', id],
    queryFn: () => getVideo(id),
    enabled: Boolean(id),
    retry: 1,
  })

  if (!id) return <PlayerMessage>Choose a video to play.</PlayerMessage>
  if (result.isLoading) return <PlayerMessage>Loading player...</PlayerMessage>
  if (result.isError) return <PlayerMessage>{result.error instanceof Error ? result.error.message : 'The video could not be loaded.'}</PlayerMessage>

  return <main className="flex h-[calc(100vh-4rem)] w-full items-center justify-center bg-black">
    <div className="aspect-video w-full bg-black">
      <YouTube
        videoId={id}
        iframeClassName="h-full w-full"
        onReady={() => result.data && useAppStore.getState().addHistory(result.data)}
        opts={{
          width: '100%',
          height: '100%',
          playerVars: { autoplay: 1, controls: 1, fs: 1, rel: 0, playsinline: 1, modestbranding: 1, iv_load_policy: 3 },
        }}
      />
    </div>
  </main>
}

function PlayerMessage({ children }: { children: React.ReactNode }) {
  return <main className="grid h-[calc(100vh-4rem)] place-items-center bg-black px-4 text-center text-white">{children}</main>
}

export function LegacyWatchPage() {
  const [params] = useSearchParams(); const id = params.get('v') ?? videos[0].id
  const result = useQuery({ queryKey: ['video', id], queryFn: () => getVideo(id), enabled: Boolean(id) })
  const video = result.data ?? videos.find((item) => item.id === id) ?? videos[0]
  const store = useAppStore(); const addHistory = useAppStore((state) => state.addHistory)
  const [expanded, setExpanded] = useState(false); const [copied, setCopied] = useState(false)
  const liked = store.liked.some((item) => item.id === video.id); const saved = store.watchLater.some((item) => item.id === video.id); const subscribed = store.subscriptions.includes(video.channelId)
  useEffect(() => { if (result.data) addHistory(result.data) }, [id, addHistory, result.data])
  if (result.isLoading) return <div className="grid min-h-[60vh] place-items-center text-zinc-500">Loading video…</div>
  if (result.isError) return <div className="grid min-h-[60vh] place-items-center text-center"><div><h1 className="text-xl font-semibold">Video could not be loaded</h1><p className="mt-2 text-sm text-zinc-500">{result.error instanceof Error ? result.error.message : 'Check the video ID and API settings.'}</p><button onClick={() => result.refetch()} className="mt-4 rounded-full bg-red-600 px-5 py-2 font-semibold text-white">Retry</button></div></div>
  const share = async () => { await navigator.clipboard.writeText(window.location.href); setCopied(true); window.setTimeout(() => setCopied(false), 1500) }
  return <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-6 p-0 md:p-4 xl:grid-cols-[minmax(0,1fr)_400px]"><section><div className="aspect-video bg-black"><YouTube videoId={video.id} iframeClassName="h-full w-full" opts={{ width: '100%', height: '100%', playerVars: { autoplay: 0, rel: 0 } }} /></div><div className="px-4 md:px-0"><h1 className="mt-3 text-xl font-bold md:text-2xl">{video.title}</h1><div className="flex flex-wrap items-center gap-2 py-3"><Link to={`/channel/${video.channelId}`} className="mr-auto flex items-center gap-3"><img src={video.avatar} alt="" className="h-10 w-10 rounded-full" /><div><p className="font-semibold">{video.channel}</p><p className="text-xs text-zinc-500">1.2M subscribers</p></div></Link><button onClick={() => store.toggleSubscription(video.channelId)} className={`action-button ${subscribed ? '!bg-zinc-200 dark:!bg-zinc-800 !text-zinc-950 dark:!text-white' : ''}`}>{subscribed && <Check />}{subscribed ? 'Subscribed' : 'Subscribe'}</button><button onClick={() => store.toggleLiked(video)} className="action-button"><ThumbsUp className={liked ? 'fill-current' : ''} />Like</button><button className="action-button"><ThumbsDown />Dislike</button><button onClick={share} className="action-button">{copied ? <Check /> : <Share2 />}{copied ? 'Copied' : 'Share'}</button><button onClick={() => store.toggleWatchLater(video)} className="action-button">{saved ? <Check /> : <ListPlus />}{saved ? 'Saved' : 'Save'}</button></div><button onClick={() => setExpanded(!expanded)} className="w-full rounded-lg bg-zinc-100 p-3 text-left text-sm dark:bg-zinc-800"><strong>{video.views} · {new Date(video.publishedAt).toLocaleDateString()}</strong><p className="mt-2">{expanded ? video.description : `${video.description?.slice(0, 120)}${(video.description?.length ?? 0) > 120 ? '…' : ''}`}</p><span className="mt-2 block font-semibold">{expanded ? 'Show less' : 'Show more'}</span></button><Comments /></div></section><aside><h2 className="mb-3 px-4 text-lg font-semibold md:px-0">Related</h2>{videos.filter((item) => item.id !== video.id).slice(0, 8).map((item) => <Link key={item.id} to={`/watch?v=${item.id}`} className="flex gap-2 px-4 py-1.5 md:px-0"><img src={item.thumbnail} alt="" className="aspect-video w-40 rounded-lg object-cover" /><div><h3 className="line-clamp-2 text-sm font-semibold">{item.title}</h3><p className="mt-1 text-xs text-zinc-500">{item.channel}<br />{item.views}</p></div></Link>)}</aside></div>
}

function Comments() {
  const [sort, setSort] = useState('Top'); const comments = ['This is exactly the kind of thoughtful breakdown I needed.', 'The pacing and production quality are fantastic.', 'The timestamp guide made this much easier to follow.']
  return <section className="py-6"><div className="flex items-center gap-4"><h2 className="text-xl font-semibold">128 comments</h2><button onClick={() => setSort(sort === 'Top' ? 'Newest' : 'Top')} className="text-sm font-semibold">Sort: {sort}</button></div><div className="mt-5 space-y-5">{comments.map((comment, index) => <div key={comment} className="flex gap-3"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sky-700 text-sm font-bold text-white">{index + 1}</div><div><p className="text-sm font-semibold">Viewer {index + 1}</p><p className="mt-1 text-sm">{comment}</p><div className="mt-2 flex gap-4 text-xs"><span className="flex items-center gap-1"><ThumbsUp className="h-4 w-4" />{12 + index * 6}</span><ThumbsDown className="h-4 w-4" /><button>Reply</button></div></div></div>)}</div></section>
}
