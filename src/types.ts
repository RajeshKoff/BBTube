export interface Video {
  id: string
  title: string
  description?: string
  thumbnail: string
  channel: string
  channelId: string
  avatar: string
  views: string
  publishedAt: string
  duration: string
  live?: boolean
}

export interface HistoryItem extends Video {
  watchedAt: number
}

export interface Playlist {
  id: string
  title: string
  description: string
  videos: Video[]
}
