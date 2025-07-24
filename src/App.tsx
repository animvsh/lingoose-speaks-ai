import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';

// Import pages
import Landing from '@/pages/Landing';
import Auth from '@/pages/Auth';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';

// Import styles
import './App.css';

// Create a stable QueryClient instance
let queryClientInstance: QueryClient | null = null;

function getQueryClient() {
  if (!queryClientInstance) {
    queryClientInstance = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: 1,
          staleTime: 1000 * 60 * 5, // 5 minutes
          gcTime: 1000 * 60 * 10, // 10 minutes
        },
        mutations: {
          retry: 1,
        },
      },
    });
  }
  return queryClientInstance;
}

// Main App Component
function App() {
  // Use stable client reference
  const queryClient = getQueryClient();
  
  return React.createElement(
    QueryClientProvider,
    { client: queryClient },
    React.createElement(
      AuthProvider,
      null,
      React.createElement(
        'div',
        { className: 'app-container min-h-screen' },
        React.createElement(
          BrowserRouter,
          null,
          React.createElement(
            Routes,
            null,
            React.createElement(Route, { path: '/', element: React.createElement(Landing) }),
            React.createElement(Route, { path: '/auth', element: React.createElement(Auth) }),
            React.createElement(Route, { path: '/app', element: React.createElement(Index) }),
            React.createElement(Route, { path: '/privacy-policy', element: React.createElement(PrivacyPolicy) }),
            React.createElement(Route, { path: '/terms-of-service', element: React.createElement(TermsOfService) }),
            React.createElement(Route, { path: '*', element: React.createElement(NotFound) })
          ),
          React.createElement(Toaster)
        )
      )
    )
  );
}

export default App;