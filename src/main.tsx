
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

// Initialize PostHog only if key is provided and we're in browser environment
if (typeof window !== 'undefined' && import.meta.env.VITE_PUBLIC_POSTHOG_KEY) {
  posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    autocapture: true,
    capture_pageview: true,
    debug: import.meta.env.DEV,
    loaded: (posthog) => {
      if (import.meta.env.DEV) console.log('PostHog loaded successfully')
    }
  })
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

const root = createRoot(rootElement);

// Conditionally wrap with PostHogProvider only if PostHog is properly initialized
const AppWithProviders = () => {
  if (typeof window !== 'undefined' && import.meta.env.VITE_PUBLIC_POSTHOG_KEY && posthog.__loaded) {
    return (
      <PostHogProvider client={posthog}>
        <App />
      </PostHogProvider>
    );
  }
  
  return <App />;
};

root.render(<AppWithProviders />);
