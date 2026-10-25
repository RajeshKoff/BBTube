import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { HistoryItem, Playlist, Video } from '@/types'

interface AppState {
  theme: 'light' | 'dark'
  sidebar: boolean
  mobileSidebar: boolean
  region: string
  language: string
  historyPaused: boolean
  subscriptions: string[]
  history: HistoryItem[]
  liked: Video[]
  watchLater: Video[]
  playlists: Playlist[]
  toggleTheme: () => void
  toggleSidebar: () => void
  setMobileSidebar: (value: boolean) => void
  setRegion: (value: string) => void
  setLanguage: (value: string) => void
  toggleSubscription: (channelId: string) => void
  addHistory: (video: Video) => void
  removeHistory: (id: string) => void
  clearHistory: () => void
  toggleHistoryPaused: () => void
  toggleLiked: (video: Video) => void
  toggleWatchLater: (video: Video) => void
  reset: () => void
}

export const useAppStore = create<AppState>()(persist((set) => ({
  theme: 'dark', sidebar: true, mobileSidebar: false, region: 'US', language: 'en', historyPaused: false,
  subscriptions: [], history: [], liked: [], watchLater: [], playlists: [],
  toggleTheme: () => set({ theme: 'dark' }),
  toggleSidebar: () => set((state) => ({ sidebar: !state.sidebar })),
  setMobileSidebar: (mobileSidebar) => set({ mobileSidebar }),
  setRegion: (region) => set({ region }), setLanguage: (language) => set({ language }),
  toggleSubscription: (channelId) => set((state) => ({ subscriptions: state.subscriptions.includes(channelId) ? state.subscriptions.filter((id) => id !== channelId) : [...state.subscriptions, channelId] })),
  addHistory: (video) => set((state) => state.historyPaused ? state : ({ history: [{ ...video, watchedAt: Date.now() }, ...state.history.filter((item) => item.id !== video.id)].slice(0, 200) })),
  removeHistory: (id) => set((state) => ({ history: state.history.filter((item) => item.id !== id) })), clearHistory: () => set({ history: [] }),
  toggleHistoryPaused: () => set((state) => ({ historyPaused: !state.historyPaused })),
  toggleLiked: (video) => set((state) => ({ liked: state.liked.some((item) => item.id === video.id) ? state.liked.filter((item) => item.id !== video.id) : [video, ...state.liked] })),
  toggleWatchLater: (video) => set((state) => ({ watchLater: state.watchLater.some((item) => item.id === video.id) ? state.watchLater.filter((item) => item.id !== video.id) : [video, ...state.watchLater] })),
  reset: () => set({ theme: 'dark', sidebar: true, region: 'US', language: 'en', historyPaused: false, subscriptions: [], history: [], liked: [], watchLater: [], playlists: [] }),
}), { name: 'krtube-library' }))
