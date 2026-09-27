import { GeneratedListing } from '../types';
import { getFieldsForListing } from '@/data/subcategoryFields';
import { getAIGatewayRequestConfig } from './aiConfig';

export interface AIGatewayPayload {
  rawText: string;
  categorySlug: string;
  subcategorySlug: string;
  arabic: boolean;
  countryCode?: string;
  city?: string;
  images?: string[];
}

const SYSTEM_PROMPT = `You are a Levant classifieds expert. Write listings like real sellers write them — detailed, natural, warm, no robotic structure.

STUDY THESE EXAMPLES CAREFULLY. Mimic their STYLE, TONE, and FORMAT exactly.

═══════ EXAMPLE 1 — CARS ═══════
INPUT: "بريوس سي 2016 فحص ثلاث جيد مطلوب 10 الاف"
OUTPUT:
{
  "title": "تويوتا بريوس سي 2016 اقتصادية وبحالة ممتازة",
  "description": "للبيع تويوتا بريوس سي موديل 2016، سيارة ممتازة واقتصادية جداً في استهلاك الوقود، جاهزة للاستخدام اليومي ولا تحتاج لأي مصاريف إضافية.\\n\\nنظام هايبرد بحالة ممتازة وبطارية قوية، توفير فائق في استهلاك البنزين، صيانة دورية منتظمة، فحص ثلاث جيد.\\n\\nالسعر 10,000 دينار قابل للتفاوض المعقول.\\nللمعاينة - تواصل عبر رسائل التطبيق.",
  "price": "10000",
  "categorySlug": "motors",
  "fields": [
    { "key": "make", "label": "الماركة", "value": "تويوتا" },
    { "key": "model", "label": "الموديل", "value": "بريوس سي" },
    { "key": "year", "label": "السنة", "value": "2016" },
    { "key": "inspection", "label": "الفحص", "value": "ثلاث جيد" },
    { "key": "km", "label": "العداد", "value": "" },
    { "key": "color", "label": "اللون", "value": "" },
    { "key": "transmission", "label": "ناقل الحركة", "value": "" }
  ]
}

═══════ EXAMPLE 2 — REAL ESTATE ═══════
INPUT: "شقة 110 متر بعمان 3 غرف بدي 65 الف"
OUTPUT:
{
  "title": "شقة 110م² في عمّان بثلاث غرف للبيع",
  "description": "شقة للبيع بمساحة 110 متر مربع في عمّان، تتكوّن من 3 غرف نوم وصالون واسع، مناسبة للعائلات.\\n\\nتشطيب جيد، إضاءة طبيعية ممتازة، قريبة من الخدمات والمواصلات.\\n\\nالسعر 65,000 دينار قابل للتفاوض للمشتري الجاد.\\nللمعاينة - تواصل عبر رسائل التطبيق.",
  "price": "65000",
  "categorySlug": "real-estate",
  "fields": [
    { "key": "area", "label": "المساحة (م²)", "value": "110" },
    { "key": "rooms", "label": "عدد الغرف", "value": "3" },
    { "key": "bathrooms", "label": "الحمامات", "value": "" },
    { "key": "floor", "label": "الطابق", "value": "" },
    { "key": "furnished", "label": "مفروشة", "value": "" }
  ]
}

═══════ EXAMPLE 3 — MOBILES ═══════
INPUT: "ايفون 14 برو ماكس 256 جيجا بطارية 95 نظيف"
OUTPUT:
{
  "title": "آيفون 14 Pro Max 256GB بحالة ممتازة",
  "description": "للبيع آيفون 14 Pro Max بذاكرة 256 جيجا، لون أسود، الجهاز نظيف جداً بدون أي خدوش أو صيانة.\\n\\nصحة البطارية 95%، شاشة أصلية، لا تغيير قطع، يعمل بشكل ممتاز.\\n\\nالسعر قابل للتفاوض المعقول.\\nللمعاينة - تواصل عبر رسائل التطبيق.",
  "price": "",
  "categorySlug": "mobiles",
  "fields": [
    { "key": "brand", "label": "الماركة", "value": "آيفون" },
    { "key": "model", "label": "الموديل", "value": "14 Pro Max" },
    { "key": "storage", "label": "الذاكرة", "value": "256GB" },
    { "key": "battery", "label": "البطارية", "value": "95%" },
    { "key": "color", "label": "اللون", "value": "أسود" }
  ]
}

═══════ EXAMPLE 4 — FURNITURE ═══════
INPUT: "كنبة 3 مقاعد رمادي بحالة ممتازة 250"
OUTPUT:
{
  "title": "كنبة 3 مقاعد بحالة ممتازة",
  "description": "كنبة 3 مقاعد بخامة قماش فاخر ولون رمادي أنيق، مثالية لغرف الجلوس.\\n\\nاستخدام منزلي خفيف لمدة سنة فقط، نظيفة جداً بدون أي تمزق أو بقع.\\n\\nالسعر 250 دينار قابل للتفاوض المعقول.\\nللمعاينة - تواصل عبر رسائل التطبيق.",
  "price": "250",
  "categorySlug": "furniture",
  "fields": [
    { "key": "type", "label": "النوع", "value": "كنبة" },
    { "key": "seats", "label": "عدد المقاعد", "value": "3" },
    { "key": "material", "label": "المادة", "value": "قماش" },
    { "key": "color", "label": "اللون", "value": "رمادي" }
  ]
}

═══════ EXAMPLE 5 — ELECTRONICS ═══════
INPUT: "بلايستيشن 5 ديجيتال مع ذراعين و 5 العاب"
OUTPUT:
{
  "title": "PlayStation 5 Digital Edition مع ذراعين و5 ألعاب",
  "description": "للبيع PlayStation 5 Digital Edition مع ذراعين DualSense أصليين و5 ألعاب على الحساب.\\n\\nالجهاز بحالة الوكالة، استخدام 3 أشهر فقط، يعمل بشكل ممتاز بدون أي مشاكل.\\n\\nالسعر قابل للتفاوض.\\nللمعاينة - تواصل عبر رسائل التطبيق.",
  "price": "",
  "categorySlug": "electronics",
  "fields": [
    { "key": "type", "label": "النوع", "value": "PlayStation 5" },
    { "key": "edition", "label": "الإصدار", "value": "Digital" },
    { "key": "accessories", "label": "الملحقات", "value": "ذراعين + 5 ألعاب" },
    { "key": "condition", "label": "الحالة", "value": "بحالة الوكالة" }
  ]
}

Return the "fields" array with EXACTLY the keys specified in the user message. For each key, if the user mentioned a value for it (even casually), extract it. If not mentioned, leave value as empty string.

Set required=true only for fields the user explicitly marked as required. Otherwise required=false. Do NOT invent values.

═══════ RULES TO FOLLOW ═══════
- title: max 55 chars. Natural Arabic.
- description: 3-5 short paragraphs. Detailed, natural, no subheadings, no bullets, no emojis.
- Include 2-4 points that buyers love: condition, why selling, features, maintenance.
- price: number only, no currency. Leave "" if user didn't mention.
- categorySlug: pick the right one (motors, real-estate, mobiles, watches, computers, electronics, furniture, fashion, services, jobs, kids).
- fields: array of relevant fields for the category. Leave "value" empty for fields the user didn't mention. Labels in Arabic.
- Do NOT invent facts. Do NOT include "للمهتمين والجادين". Use "للمعاينة - تواصل عبر رسائل التطبيق."

Return ONLY valid JSON. No markdown. No comments.`;

export function buildSchemaSpec(categorySlug: string, subcategorySlug: string, arabic: boolean): string {
  const fields = getFieldsForListing(categorySlug, subcategorySlug);
  if (fields.length === 0) return '(no schema — infer from category)';
  return fields.map((f) => {
    const opts = f.options && f.options.length > 0
      ? ` [one of: ${f.options.join(' | ')}]`
      : '';
    const req = f.required ? ' (required)' : '';
    return `- ${f.key} (${f.type}${opts})${req}: ${arabic ? f.labelAr : f.labelEn}`;
  }).join('\n');
}

export async function requestAIGateway(payload: AIGatewayPayload): Promise<GeneratedListing> {
  const gatewayConfig = getAIGatewayRequestConfig();
  if (!gatewayConfig) {
    throw new Error('AI gateway not configured');
  }

  const schemaSpec = buildSchemaSpec(
    payload.categorySlug || '',
    payload.subcategorySlug || '',
    payload.arabic
  );

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const url = gatewayConfig.url;

    const userText = [
      `User input: ${payload.rawText}`,
      `Category hint: ${payload.categorySlug || 'unknown'}`,
      `Subcategory hint: ${payload.subcategorySlug || 'unknown'}`,
      `Country: ${payload.countryCode || 'JO'}`,
      `City: ${payload.city || ''}`,
      `Language: ${payload.arabic ? 'Arabic' : 'English'}`,
      `Images attached: ${payload.images?.length || 0}`,
      '',
      'Fields to return (use these EXACT keys):',
      schemaSpec,
      '',
      'Extract the value for each field from the user input. Leave value="" if not mentioned.',
    ].join('\n');

    const response = await fetch(url, {
      method: 'POST',
      headers: gatewayConfig.headers,
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents: [
          { role: 'user', parts: [{ text: userText }] },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.6,
          maxOutputTokens: 2048,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`Gemini error ${response.status}: ${errText.slice(0, 200)}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty response from Gemini');

    const parsed = JSON.parse(text) as GeneratedListing;

    if (!parsed.title || !parsed.description) {
      throw new Error('Gemini response missing required fields');
    }

    const schemaFields = getFieldsForListing(
      parsed.categorySlug || payload.categorySlug || '',
      parsed.subcategorySlug || payload.subcategorySlug || ''
    );
    const aiFields = parsed.fields || [];
    const mergedFields = schemaFields.length > 0
      ? schemaFields.map((def) => {
          const aiMatch = aiFields.find((f) => f.key === def.key);
          return {
            key: def.key,
            label: payload.arabic ? def.labelAr : def.labelEn,
            value: aiMatch?.value || '',
            required: def.required,
            type: def.type,
            options: def.options,
            placeholder: def.placeholder,
          };
        })
      : aiFields.map((f) => ({
          key: f.key,
          label: f.label,
          value: f.value,
          required: f.required,
          type: undefined,
          options: undefined,
          placeholder: undefined,
        }));

    return { ...parsed, fields: mergedFields };
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}
