import React from 'react';
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


// One-time cleanup: wipe bloated listings from old format
try {
  const listingsRaw = localStorage.getItem('catch_listings');
  if (listingsRaw && listingsRaw.length > 200_000) { // >200KB = old bloated
    console.warn('[CLEANUP] Removing bloated listings, will reload from seed data.');
    localStorage.removeItem('catch_listings');
  }
  
  // Also clear old bloated conversations if too large
  const convsRaw = localStorage.getItem('catch_conversations');
  if (convsRaw && convsRaw.length > 200_000) {
    console.warn('[CLEANUP] Removing bloated conversations.');
    localStorage.removeItem('catch_conversations');
  }
} catch (e) {
  console.error('[CLEANUP] Failed:', e);
}

initSentry();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
