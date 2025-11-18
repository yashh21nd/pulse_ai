import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Add error boundary and debugging
console.log('🚀 Context Bridge - Main.tsx loading...');
console.log('Environment:', import.meta.env);
console.log('Root element:', document.getElementById('root'));

// Simple error boundary component
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error?: Error}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding: '20px', color: 'red', fontFamily: 'monospace'}}>
          <h1>Something went wrong.</h1>
          <p>{this.state.error?.message}</p>
          <pre>{this.state.error?.stack}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  console.log('✅ Root element found, creating React root...');
  const root = ReactDOM.createRoot(rootElement);
  
  console.log('✅ React root created, rendering app...');
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <div style={{padding: '20px'}}>
          <h1 style={{color: '#333'}}>🔗 Context Bridge</h1>
          <p>Loading application...</p>
          <App />
        </div>
      </ErrorBoundary>
    </React.StrictMode>,
  );
  
  console.log('✅ App rendered successfully');
} catch (error) {
  console.error('❌ Failed to render app:', error);
  // Fallback rendering
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: Arial;">
      <h1 style="color: red;">Context Bridge - Loading Error</h1>
      <p>Failed to load the React application.</p>
      <p>Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
      <pre style="background: #f5f5f5; padding: 10px;">${error instanceof Error ? error.stack : JSON.stringify(error, null, 2)}</pre>
    </div>
  `;
}