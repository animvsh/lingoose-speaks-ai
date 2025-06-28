
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import SplashScreen from "./components/SplashScreen";
import { useState, useEffect } from "react";
import { initializePostHog } from "@/services/posthog";

const queryClient = new QueryClient();

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Initialize PostHog with your actual API key
    const POSTHOG_API_KEY = 'phc_gWiJt0Hk9hP4ZNfBCWmqKiMwQOHvxowdJtxQ49jGu8J';
    const POSTHOG_HOST = 'https://us.i.posthog.com';
    
    if (POSTHOG_API_KEY && POSTHOG_API_KEY !== 'your-posthog-api-key-here') {
      initializePostHog(POSTHOG_API_KEY, POSTHOG_HOST);
      console.log('PostHog initialized with API key');
    } else {
      console.warn('PostHog API key not configured');
    }

    // Show splash screen for at least 2 seconds to mask any initial loading
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
