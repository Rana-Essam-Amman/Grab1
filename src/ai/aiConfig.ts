/**
 * Central AI gateway configuration — SINGLE SOURCE OF TRUTH.
 *
 * PRODUCTION: Requests go to /api/gemini (Cloudflare Pages Function proxy).
 *   API key lives server-side in Cloudflare env. Zero client exposure.
 *
 * DEVELOPMENT (vite dev): Falls back to direct Google call with VITE_GEMINI_API_KEY
 *   because vite dev doesn't emulate Cloudflare Pages Functions.
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
  // Production: proxy through Cloudflare Pages Function (no key in bundle).
  if (import.meta.env.PROD) {
    return AI_MODEL_CHAIN.map((model) => ({
      model,
      url: `/api/gemini?model=${encodeURIComponent(model)}`,
      headers: { 'Content-Type': 'application/json' },
    }));
  }

  // Development: direct call to Google with local key.
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
