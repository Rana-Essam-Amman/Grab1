// Auth public API — store, helpers, hooks.
//
// IMPORTANT: Do NOT re-export screens from this barrel.
// Screens are lazy-loaded by exact path in App.tsx. Barrel-exporting them
// causes ANY consumer of '@/features/auth' (including boot-time hooks like
// useMarketSync) to eager-load all auth screens. This broke the register
// E2E flow (golden-paths/register.spec.ts) on 2026-10-09.
//
// If you need a new export here: it must be a store, hook, helper, or type —
// never a screen.

export { useAuthStore, hydrateProfile } from './store/auth.slice';
export type { AuthState } from './store/auth.slice.types';

export { useSupabaseAuthListener } from './hooks/useSupabaseAuthListener';
export { useAuthProviders } from './hooks/useAuthProviders';
export type { UseAuthProvidersReturn } from './hooks/useAuthProviders';

export { getCurrentUser, requirePhoneForPublish } from './helpers/publishPhoneGuard';

// Phone capture flow (used by GlobalPhoneCaptureMount)
export { PhoneCaptureModal } from './components/PhoneCaptureModal';
export { usePhoneModalStore } from './store/phoneModal.slice';
