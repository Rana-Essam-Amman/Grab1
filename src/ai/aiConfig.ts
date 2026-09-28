/**
 * Central AI gateway configuration — SINGLE SOURCE OF TRUTH.
 *
 * CURRENT (dev/Beta): Direct Gemini call from the client using VITE_GEMINI_API_KEY.
 * The key IS exposed in the client bundle. Acceptable ONLY for internal testing
 * until the backend is live.
 *
 * BEFORE PUBLIC LAUNCH:
 *   1. Deploy a Supabase Edge Function: `supabase/functions/ai-proxy`
 *   2. Return the function endpoint from this file
 *   3. Remove VITE_GEMINI_API_KEY from .env.local
 *   4. This file is the ONLY file that needs to change.
 */

export interface AIGatewayRequestConfig {
  readonly url: string;
  readonly headers: Record<string, string>;
}

export function getAIGatewayRequestConfig(): AIGatewayRequestConfig | null {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  if (!apiKey) return null;

  return {
    url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
    headers: { 'Content-Type': 'application/json' },
  };
}
