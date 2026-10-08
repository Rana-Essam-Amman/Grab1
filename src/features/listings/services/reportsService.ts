import { supabase } from '@/shared/lib/supabase';

export interface SubmitListingReportInput {
  readonly listingId: string;
  readonly reason: string;
  readonly details?: string;
}

export interface SubmitListingReportResult {
  readonly error: string | null;
}

/**
 * Persist a listing report to Supabase.
 * RLS enforces: only authenticated users, only own reports.
 */
export async function submitListingReport(
  input: SubmitListingReportInput
): Promise<SubmitListingReportResult> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      return { error: 'يجب تسجيل الدخول للإبلاغ' };
    }

    const trimmedReason = input.reason.trim();
    if (trimmedReason.length < 3 || trimmedReason.length > 80) {
      return { error: 'سبب الإبلاغ غير صالح' };
    }

    const trimmedDetails = input.details?.trim() ?? '';
    const details = trimmedDetails.length > 0 ? trimmedDetails.slice(0, 1000) : null;

    const { error } = await supabase.from('listing_reports').insert({
      listing_id: input.listingId,
      reporter_id: userData.user.id,
      reason: trimmedReason,
      details,
    });

    if (error) return { error: error.message };
    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
