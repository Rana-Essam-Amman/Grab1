import React from 'react';
import { globalStorage } from '../lib/marketStorage';
import { Warning2 } from 'iconsax-react';
import { Sentry } from '@/config/sentry.init';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

const getErrorLabels = (isArabic: boolean) => ({
  title: isArabic ? 'حدث خطأ غير متوقع' : 'Something went wrong',
  body: isArabic
    ? 'واجه التطبيق خطأً غير متوقع. تم تسجيل التفاصيل لفريقنا.'
    : "The application encountered an unexpected error. We've logged the details for our team.",
  retry: isArabic ? 'إعادة المحاولة' : 'Try Again',
  reset: isArabic ? 'إعادة تعيين التطبيق (مسح البيانات)' : 'Reset App (Clear Data)',
  details: isArabic ? 'التفاصيل التقنية' : 'Technical Details',
});

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    try {
      Sentry.captureException(error, {
        extra: { componentStack: errorInfo.componentStack },
      });
    } catch {}
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

  private resetApp = () => {
    // 🛡️ Preserve listings — never wipe catch_listings* (they must never vanish).
    Object.keys(localStorage)
      .filter((k) => !k.startsWith('catch_listings'))
      .forEach((k) => { try { localStorage.removeItem(k); } catch {} });
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    // Read locale from storage so the fallback renders in the user's language,
    // even when the app itself has crashed.
    const isArabic = (globalStorage().get<string>('locale') || 'ar') === 'ar';
    const t = getErrorLabels(isArabic);

    return (
      <div
        dir={isArabic ? 'rtl' : 'ltr'}
        style={{
          padding: '40px 20px',
          background: 'var(--color-canvas, #F9FAFB)',
          color: 'var(--color-ink, #111827)',
          fontFamily: 'var(--font-arabic, "Almarai", system-ui, sans-serif)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <div style={{ marginBottom: '20px', color: 'var(--color-danger, #DC2626)' }}>
          <Warning2 size={48} variant="Bold" />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>{t.title}</h2>
        <p style={{ color: 'var(--color-ink-muted, #6B7280)', marginBottom: '24px', maxWidth: '400px' }}>
          {t.body}
        </p>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              background: 'var(--color-primary, #1B2A4A)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              minHeight: '44px',
            }}
          >
            {t.retry}
          </button>
          <button
            onClick={this.resetApp}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              color: 'var(--color-danger, #DC2626)',
              border: '1px solid var(--color-danger, #DC2626)',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              minHeight: '44px',
            }}
          >
            {t.reset}
          </button>
        </div>

        <details style={{ textAlign: isArabic ? 'right' : 'left', width: '100%', maxWidth: '600px', background: 'var(--soft, #F3F4F6)', padding: '16px', borderRadius: '12px' }}>
          <summary style={{ cursor: 'pointer', fontWeight: '600', color: 'var(--color-ink-muted, #4B5563)' }}>
            {t.details}
          </summary>
          <div style={{ marginTop: '12px', fontSize: '12px', fontFamily: 'monospace', overflowX: 'auto', direction: 'ltr' }}>
            <div style={{ fontWeight: 'bold', color: 'var(--color-danger, #DC2626)', marginBottom: '8px' }}>
              {this.state.error?.message}
            </div>
            <pre style={{ opacity: 0.7 }}>{this.state.error?.stack}</pre>
          </div>
        </details>
      </div>
    );
  }
}
