import { GeneratedListing } from '../types';

export interface AIGatewayPayload {
  rawText: string;
  categorySlug: string;
  subcategorySlug: string;
  arabic: boolean;
  countryCode?: string;
  city?: string;
  images?: string[];
}

const SYSTEM_PROMPT = `
You are a veteran local Levant classified ads copywriter and multi-modal vision inspection expert. 
Analyze both textual notes and image pixel streams to detect item model, exact condition, and taxonomy.
Your output must sound 100% human, natural, and conversational in the local dialect/Arabic or English as requested.
STRICT BANS: Absolutely NO bold markdown asterisks (**), NO robotic bullet points, NO artificial sparkles or emojis (✨, 🤖, 🌟, 📞, 🛠️).
Return ONLY valid JSON matching this exact structure:
{
  "title": "string",
  "description": "string",
  "price": "string",
  "categorySlug": "string",
  "subcategorySlug": "string",
  "city": "string",
  "year": "string",
  "make": "string",
  "missing": []
}
`;

export async function requestAIGateway(payload: AIGatewayPayload): Promise<GeneratedListing> {
  const metaEnv = import.meta.env || {};
  // Default to DeepSeek as requested for multi-modal vision processing
  const provider = metaEnv.VITE_AI_PROVIDER || 'deepseek';
  const apiKey = metaEnv.VITE_AI_API_KEY || '';

  // 4-Second Timeout Controller
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    let endpoint = 'https://api.deepseek.com/v1/chat/completions';
    if (provider === 'openai') {
      endpoint = 'https://api.openai.com/v1/chat/completions';
    } else if (provider === 'gemini') {
      endpoint = '/api/ai/generate';
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({
        model: provider === 'deepseek' ? 'deepseek-chat' : undefined,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: JSON.stringify({
              text: payload.rawText,
              category: payload.categorySlug,
              imagesCount: payload.images?.length || 0,
              images: payload.images || [],
            }),
          },
        ],
        provider,
        system: SYSTEM_PROMPT,
        prompt: JSON.stringify(payload),
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`AI Gateway error status: ${response.status}`);
    }

    const data = await response.json();
    if (data && data.title && data.description) {
      return data as GeneratedListing;
    }
    // Handle OpenAI/DeepSeek chat completion format if returned directly
    if (data && data.choices && data.choices[0]?.message?.content) {
      try {
        const parsed = JSON.parse(data.choices[0].message.content);
        if (parsed.title && parsed.description) {
          return parsed as GeneratedListing;
        }
      } catch {}
    }

    throw new Error('Invalid JSON response structure from gateway');
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}
