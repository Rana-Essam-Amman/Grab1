import React from 'react';
import { logError } from '@/shared/lib/errorLogger';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initSentry } from './config/sentry.init';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';

try {
  const saved = localStorage.getItem('catch_locale');
  let locale = 'ar';
  if (saved) {
    if (saved === 'en' || saved === 'ar') locale = saved;
    else {
      const parsed = JSON.parse(saved);
      locale = parsed?.state?.locale || 'ar';
    }
  }
  document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = locale;
} catch {}

window.addEventListener('error', (e) => {
  try {
    localStorage.setItem('catch_crash_last', JSON.stringify({
      message: e.message,
      filename: e.filename,
      lineno: e.lineno,
      colno: e.colno,
      stack: e.error?.stack?.slice(0, 2000),
      timestamp: new Date().toISOString(),
    }));
  } catch {}
});

window.addEventListener('unhandledrejection', (e) => {
  try {
    localStorage.setItem('catch_crash_last', JSON.stringify({
      message: 'Unhandled Promise: ' + String(e.reason),
      stack: e.reason?.stack?.slice(0, 2000),
      timestamp: new Date().toISOString(),
    }));
  } catch {}
});

// NOTE: Previously wiped catch_listings when serialized size > 200KB.
// Removed in the data-integrity fix — wiping the local cache caused
// user listings to disappear on app boot without corresponding deletion
// from the server. Listings are now merged instead of replaced on sync.

// Also clear old bloated conversations if too large
try {
  const convsRaw = localStorage.getItem('catch_conversations');
  if (convsRaw && convsRaw.length > 200_000) {
    console.warn('[CLEANUP] Removing bloated conversations.');
    localStorage.removeItem('catch_conversations');
  }
} catch (e) {
  console.error('[CLEANUP] Failed:', e);
}

initSentry();

window.addEventListener('error', (event) => {
  void logError({
    message: event.message || 'Window error',
    stack: event.error?.stack,
  });
});

window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason;
  void logError({
    message: reason?.message || 'Unhandled rejection',
    stack: reason?.stack,
  });
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
