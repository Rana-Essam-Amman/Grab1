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

export interface AIGatewayModelConfig {
  readonly url: string;
  readonly headers: Record<string, string>;
  readonly model: string;
}

export const AI_MODEL_CHAIN = [
  'gemini-flash-latest',
  'gemini-3.7-flash',
  'gemini-3.5-flash',
] as const;

export function getAIGatewayModelConfigs(): AIGatewayModelConfig[] {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  if (!apiKey) return [];

  return AI_MODEL_CHAIN.map((model) => ({
    model,
    url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    headers: { 'Content-Type': 'application/json' },
  }));
}

export function getAIGatewayRequestConfig(): AIGatewayRequestConfig | null {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  if (!apiKey) return null;

  return {
    url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
    headers: { 'Content-Type': 'application/json' },
  };
}
