import { useAuthStore } from '@/features/auth/store/auth.slice';
import { signInWithEmailPassword } from '../services/authService';
import { publishDraftAfterAuth } from './publishDraftAfterAuth';
import { waitForSession } from './waitForSession';

export interface SubmitResult {
  readonly success: boolean;
  readonly errorAr?: string;
  readonly errorEn?: string;
}

export async function submitEmailPasswordLogin(
  email: string,
  password: string,
  isArabic: boolean,
  browseCountryCode: string,
): Promise<SubmitResult> {
  try {
    const result = await signInWithEmailPassword(email, password);
    if (!result.success || !result.userId) {
      return {
        success: false,
        errorAr: result.errorMessageAr || 'حدث خطأ. حاول مرة أخرى',
        errorEn: result.errorMessageEn || 'Something went wrong. Please try again',
      };
    }

    const state = useAuthStore.getState();
    const alreadySignedIn = Boolean(
      state.sessionToken && state.user?.id === result.userId,
    );
    const sessionReady =
      alreadySignedIn || (await waitForSession(result.userId));

    if (!sessionReady) {
      return {
        success: false,
        errorAr: 'تعذر إكمال تسجيل الدخول. حاول مرة أخرى',
        errorEn: 'Could not complete sign in. Please try again',
      };
    }

    const user = useAuthStore.getState().user;
    if (user?.phone) {
      publishDraftAfterAuth(
        user.phone,
        user.firstName || 'Seller',
        user.countryCode || browseCountryCode || 'JO',
      );
    }

    return { success: true };
  } catch {
    return {
      success: false,
      errorAr: 'حدث خطأ. حاول مرة أخرى',
      errorEn: 'Something went wrong. Please try again',
    };
  }
}
