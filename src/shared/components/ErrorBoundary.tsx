import React from 'react';
import { globalStorage } from '../lib/marketStorage';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Persist to storage for post-reload inspection
    try {
      globalStorage().set('catch_crash_last', {
        message: error.message,
        stack: error.stack?.slice(0, 2000),
        componentStack: errorInfo.componentStack?.slice(0, 2000),
        timestamp: new Date().toISOString(),
      });
    } catch {}

    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
  padding: '20px',
  background: '#fee',
  color: '#900',
  fontFamily: 'monospace',
  fontSize: '12px',
  whiteSpace: 'pre-wrap',
  minHeight: '100vh',
  overflow: 'auto',
}}>
  <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>
    🚨 Runtime Error
  </h2>
  <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
    {this.state.error?.message || 'Unknown error'}
  </div>
  <details>
    <summary>Stack Trace</summary>
    <pre>{this.state.error?.stack}</pre>
  </details>
  <details>
    <summary>Component Stack</summary>
    <pre>{this.state.errorInfo?.componentStack}</pre>
  </details>
</div>
      );
    }
    return this.props.children;
  }
}

