import React from 'react';
import { globalStorage } from '../lib/marketStorage';
import { Warning2 } from 'iconsax-react';

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
          padding: '40px 20px',
          background: '#F9FAFB',
          color: '#111827',
          fontFamily: 'Inter, system-ui, sans-serif',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '20px',
            color: '#EF4444'
          }}>
            <Warning2 size={48} variant="Bold" />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
            Something went wrong
          </h2>
          <p style={{ color: '#6B7280', marginBottom: '24px', maxWidth: '400px' }}>
            The application encountered an unexpected error. We've logged the details for our team.
          </p>
          
          <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 20px',
                background: '#1B2A4A',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              style={{
                padding: '10px 20px',
                background: 'white',
                color: '#EF4444',
                border: '1px solid #EF4444',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Reset App (Clear Data)
            </button>
          </div>

          <details style={{ textAlign: 'left', width: '100%', maxWidth: '600px', background: '#F3F4F6', padding: '16px', borderRadius: '12px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: '600', color: '#4B5563' }}>Technical Details</summary>
            <div style={{ marginTop: '12px', fontSize: '12px', fontFamily: 'monospace', overflowX: 'auto' }}>
              <div style={{ fontWeight: 'bold', color: '#B91C1C', marginBottom: '8px' }}>
                {this.state.error?.message}
              </div>
              <pre style={{ opacity: 0.7 }}>{this.state.error?.stack}</pre>
            </div>
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

