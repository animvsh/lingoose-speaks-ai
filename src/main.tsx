
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

// Initialize PostHog
if (import.meta.env.VITE_PUBLIC_POSTHOG_KEY) {
  posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    // Optional: Configure additional settings
    autocapture: true,
    capture_pageview: true,
    debug: import.meta.env.DEV, // Enable debug mode in development
  })
}

createRoot(document.getElementById("root")!).render(
  <PostHogProvider client={posthog}>
    <App />
  </PostHogProvider>
);
