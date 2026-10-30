import type { PaymentParams, MarketCode } from './adminRpc';

// Verified from live RPC: admin_list_reports
export interface AdminReport {
  id: string;
  listing_id: string;
  listing_title: string;
  listing_country_code: MarketCode;
  listing_owner_id: string;
  listing_owner_name: string;
  reporter_id: string;
  reporter_name: string;
  reason: string;
  details: string | null;
  status: string;
  action_taken: string | null;
  created_at: string;
  reviewed_at: string | null;
}

// Verified from live RPC: admin_list_listings
export interface AdminListing {
  id: string;
  title: string;
  price: string;
  currency: string;
  status: string;
  is_premium: boolean;
  premium_expires_at: string | null;
  user_id: string;
  created_at: string;
}

// Verified from live RPC: admin_list_users
export interface AdminUser {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  country_code: MarketCode;
  banned: boolean;
  banned_reason: string | null;
  created_at: string;
  is_anonymous: boolean;
}

// Verified from live RPC: admin_get_dashboard
export interface DashboardMetrics {
  users: number;
  guests: number;
  listings: number;
  reports: number;
  revenue_cents: number;
  currency: string;
}

// Verified from live RPC: admin_get_dashboard recent_reports subquery
// (12 fields — no listing_owner_id/listing_owner_name)
export interface RecentReportSummary {
  id: string;
  listing_id: string;
  listing_title: string;
  listing_country_code: MarketCode;
  reporter_id: string;
  reporter_name: string;
  reason: string;
  details: string | null;
  status: string;
  action_taken: string | null;
  created_at: string;
  reviewed_at: string | null;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  recent_reports: RecentReportSummary[];
}

// Actions exposed by useAdmin and consumed by AdminTabs
export interface AdminActions {
  refresh: (market?: MarketCode) => Promise<void>;
  dismissReport: (id: string) => Promise<boolean>;
  hideListing: (id: string) => Promise<boolean>;
  banUser: (id: string, reason: string) => Promise<boolean>;
  unbanUser: (id: string) => Promise<boolean>;
  recordPayment: (params: PaymentParams) => Promise<boolean>;
}
