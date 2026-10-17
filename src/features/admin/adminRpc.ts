import { supabase } from '@/shared/lib/supabase';

export type MarketCode = 'JO' | 'SA' | 'LB' | 'PS' | 'SY';

export interface PaymentParams {
  userId: string;
  listingId?: string | null;
  product: 'turbo' | 'auto_bump' | 'featured' | 'vip_store';
  amountCents: number;
  currency: string;
}

export async function getDashboard(market: MarketCode) {
  return supabase.rpc('admin_get_dashboard', { p_country_code: market });
}

export async function listReports(market: MarketCode, status: string = 'pending') {
  return supabase.rpc('admin_list_reports', { p_country_code: market, p_status: status });
}

export async function listListings(market: MarketCode, filter: string = 'all') {
  return supabase.rpc('admin_list_listings', { p_country_code: market, p_filter: filter });
}

export async function listUsers(market: MarketCode) {
  return supabase.rpc('admin_list_users', { p_country_code: market });
}

export async function actionReport(reportId: string, action: 'dismiss' | 'hide_listing' | 'ban_user') {
  return supabase.rpc('admin_action_report', { p_report_id: reportId, p_action: action });
}

export async function hideListing(id: string) {
  return supabase.rpc('admin_hide_listing', { p_listing_id: id });
}

export async function banUser(id: string, reason: string) {
  return supabase.rpc('admin_ban_user', { p_user_id: id, p_reason: reason });
}

export async function unbanUser(id: string) {
  return supabase.rpc('admin_unban_user', { p_user_id: id });
}

export async function recordPayment(params: PaymentParams) {
  return supabase.rpc('admin_record_payment', {
    p_user_id: params.userId,
    p_listing_id: params.listingId ?? null,
    p_product: params.product,
    p_amount_cents: params.amountCents,
    p_currency: params.currency,
  });
}

// --- NEW PHONE REQUESTS RPCs ---

export async function listPendingPhoneRequests() {
  return supabase.rpc('admin_list_phone_change_requests');
}

export async function approvePhoneChangeRequest(requestId: string) {
  return supabase.rpc('admin_approve_phone_change', {
    p_request_id: requestId,
  });
}
