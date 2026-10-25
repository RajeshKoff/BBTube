# KRTube

A responsive, watch-only YouTube-style interface built with React 18, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query, Zustand, and the YouTube IFrame Player API.

## Run locally

```bash
npm install
npm run dev
```

KRTube runs in mock mode by default, so no API key is required for local development.

## Connect the YouTube Data API

1. Create or select a Google Cloud project at https://console.cloud.google.com/.
2. Enable **YouTube Data API v3**.
3. Create an API key under **Credentials**.
4. Copy `.env.example` to `.env`.
5. Set `VITE_YOUTUBE_API_KEY=your_key` and `VITE_USE_MOCK=false`.
6. Add local and deployment origins to the API key's allowed HTTP referrers when testing in the browser.

## Build and deploy

```bash
npm run build
npm run preview
```

Deploy the generated `dist` directory to Vercel or Netlify. Configure the two `VITE_` environment variables in the deployment project and enable SPA rewrites to `/index.html`.
