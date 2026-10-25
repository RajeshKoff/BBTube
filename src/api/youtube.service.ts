import axios from 'axios'
import type { Video } from '@/types'

const api = axios.create({ baseURL: 'https://www.googleapis.com/youtube/v3' })
const key = import.meta.env.VITE_YOUTUBE_API_KEY as string | undefined

interface SearchItem { id: { videoId?: string }; snippet: { title: string; channelTitle: string; channelId: string; publishedAt: string; thumbnails: { medium?: { url: string }; high?: { url: string } } } }
interface VideoItem { id: string; snippet: { title: string; description: string; channelTitle: string; channelId: string; publishedAt: string; thumbnails: { medium?: { url: string }; high?: { url: string } } }; contentDetails: { duration: string }; statistics: { viewCount: string }; liveStreamingDetails?: { concurrentViewers?: string } }

function ensureKey() { if (!key) throw new Error('Add VITE_YOUTUBE_API_KEY to .env and restart Vite.') }
function duration(value: string) { const match = value.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/) ?? []; const hours = Number(match[1] ?? 0); const minutes = Number(match[2] ?? 0); const seconds = Number(match[3] ?? 0); return hours ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}` : `${minutes}:${String(seconds).padStart(2, '0')}` }
function compactViews(value: string) { const views = Number(value); if (!Number.isFinite(views)) return '0 views'; return `${new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(views)} views` }

export async function getVideo(id: string): Promise<Video> {
  ensureKey()
  const response = await api.get<{ items: VideoItem[] }>('/videos', { params: { key, id, part: 'snippet,contentDetails,statistics,liveStreamingDetails' } })
  const item = response.data.items[0]
  if (!item) throw new Error('This video is unavailable or has been removed.')
  return {
    id: item.id, title: item.snippet.title, description: item.snippet.description,
    thumbnail: item.snippet.thumbnails.high?.url ?? item.snippet.thumbnails.medium?.url ?? '',
    channel: item.snippet.channelTitle, channelId: item.snippet.channelId, avatar: '',
    views: compactViews(item.statistics.viewCount), publishedAt: item.snippet.publishedAt,
    duration: duration(item.contentDetails.duration), live: Boolean(item.liveStreamingDetails),
  }
}

export async function searchVideos(query: string, pageToken?: string, liveOnly = false) {
  ensureKey()
  const search = await api.get<{ items: SearchItem[]; nextPageToken?: string }>('/search', { params: { key, q: query, type: 'video', eventType: liveOnly ? 'live' : undefined, videoEmbeddable: 'true', safeSearch: 'none', part: 'snippet', maxResults: 24, ...(pageToken ? { pageToken } : {}) } })
  const ids = search.data.items.map((item) => item.id.videoId).filter((id): id is string => Boolean(id))
  if (!ids.length) return { items: [] as Video[], nextPageToken: search.data.nextPageToken }
  const details = await api.get<{ items: VideoItem[] }>('/videos', { params: { key, id: ids.join(','), part: 'snippet,contentDetails,statistics,liveStreamingDetails', maxResults: 50 } })
  const byId = new Map(details.data.items.map((item) => [item.id, item]))
  const items = ids.map((id) => byId.get(id)).filter((item): item is VideoItem => Boolean(item)).map((item) => ({
    id: item.id, title: item.snippet.title, description: item.snippet.description, thumbnail: item.snippet.thumbnails.high?.url ?? item.snippet.thumbnails.medium?.url ?? '', channel: item.snippet.channelTitle, channelId: item.snippet.channelId, avatar: '', views: compactViews(item.statistics.viewCount), publishedAt: item.snippet.publishedAt, duration: duration(item.contentDetails.duration), live: Boolean(item.liveStreamingDetails),
  }))
  return { items, nextPageToken: search.data.nextPageToken }
}
