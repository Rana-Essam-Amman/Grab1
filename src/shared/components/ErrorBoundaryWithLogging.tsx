import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logError } from '@/shared/lib/errorLogger';

interface Props {
  readonly children: ReactNode;
  readonly fallback?: ReactNode;
}

interface State {
  readonly hasError: boolean;
}

export class ErrorBoundaryWithLogging extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    void logError({
      message: error.message || 'Unknown error',
      stack: error.stack,
      componentStack: info.componentStack || '',
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex flex-col items-center justify-center gap-3 p-6 text-center" dir="rtl">
            <h2 className="text-lg font-bold text-ink">حدث خطأ غير متوقع</h2>
            <p className="text-sm text-ink-muted">تم إبلاغ فريق التطوير. جرب تحديث الصفحة.</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm"
            >
              تحديث
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
