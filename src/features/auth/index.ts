export { LoginScreen } from './screens/LoginScreen';
export { RegisterScreen } from './screens/RegisterScreen';
export { ConfirmScreen } from './screens/ConfirmScreen';
export { TermsScreen } from './screens/TermsScreen';

export { useAuthProviders } from './hooks/useAuthProviders';
export type { UseAuthProvidersReturn } from './hooks/useAuthProviders';

// Public API — store + helpers
export { useAuthStore, hydrateProfile } from './store/auth.slice';
export type { AuthState } from './store/auth.slice.types';
export { getCurrentUser, requirePhoneForPublish } from './helpers/publishPhoneGuard';
export { useSupabaseAuthListener } from './hooks/useSupabaseAuthListener';

// Public API — phone capture flow (used by GlobalPhoneCaptureMount)
export { PhoneCaptureModal } from './components/PhoneCaptureModal';
export { usePhoneModalStore } from './store/phoneModal.slice';
