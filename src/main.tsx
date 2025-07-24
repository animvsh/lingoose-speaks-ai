import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure React is properly initialized
const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(container);

// Wrap in error boundary to catch any rendering issues
class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if ((this.state as any).hasError) {
      return React.createElement('div', {
        style: {
          padding: '20px',
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif'
        }
      }, [
        React.createElement('h1', { key: 'title' }, 'Something went wrong.'),
        React.createElement('p', { key: 'message' }, 'Please refresh the page.'),
        React.createElement('button', {
          key: 'refresh',
          onClick: () => window.location.reload(),
          style: {
            padding: '10px 20px',
            marginTop: '10px',
            backgroundColor: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }
        }, 'Refresh Page')
      ]);
    }

    return (this.props as any).children;
  }
}

root.render(
  React.createElement(ErrorBoundary, null,
    React.createElement(App)
  )
);