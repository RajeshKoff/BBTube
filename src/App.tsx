import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { HomePage, SearchPage, FeedPage, LivePage, ShortsPage, PlaylistPage } from '@/pages/BrowsePages'
import { ChannelPage, LibraryPage, SettingsPage, SubscriptionsPage } from '@/pages/LibraryPages'
import { WatchPage } from '@/pages/WatchPage'

export default function App() {
  return <BrowserRouter><Routes><Route element={<Layout />}><Route index element={<HomePage />} /><Route path="results" element={<SearchPage />} /><Route path="watch" element={<WatchPage />} /><Route path="shorts/:id" element={<ShortsPage />} /><Route path="channel/:id" element={<ChannelPage />} /><Route path="playlist" element={<PlaylistPage />} /><Route path="live" element={<LivePage />} /><Route path="feed/subscriptions" element={<SubscriptionsPage />} /><Route path="feed/history" element={<LibraryPage mode="History" />} /><Route path="feed/liked" element={<LibraryPage mode="Liked" />} /><Route path="feed/watch-later" element={<LibraryPage mode="Watch later" />} /><Route path="feed/playlists" element={<LibraryPage mode="Playlists" />} /><Route path="feed/trending" element={<FeedPage />} /><Route path="settings" element={<SettingsPage />} /><Route path="*" element={<div className="grid min-h-[60vh] place-items-center"><h1 className="text-3xl font-bold">404</h1></div>} /></Route></Routes></BrowserRouter>
}

/*

    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

*/
