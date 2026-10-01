import { GeneratedListing } from '../types';
import { getFieldsForListing } from '@/data/subcategoryFields';
import { getAIGatewayModelConfigs } from './aiConfig';
import { AI_RESPONSE_SCHEMA, withRetry } from './aiSchemas';

export interface AIGatewayPayload {
  rawText: string;
  categorySlug: string;
  subcategorySlug: string;
  arabic: boolean;
  countryCode?: string;
  city?: string;
  images?: string[];
}

const SYSTEM_PROMPT = `You are FOX Marketplace's Arabic classifieds copywriter for MENA (Jordan, Lebanon, Palestine, Syria, Saudi Arabia).

## YOUR ONLY JOB
1. Write a compelling TITLE (40-65 chars)
2. Write a marketing DESCRIPTION (3 short paragraphs)
3. Echo back the schema fields (from user input only)

## TITLE — 40 to 65 characters
Structure: [subject with make/model/year if present] — [emotional hook]
Add ONE benefit/hook. NO price. NO emoji. NO ALL CAPS.

Examples by category:
- Cars: تويوتا كامري 2020 هايبرد — اقتصادية وفرصة ممتازة
- Mobiles: آيفون 14 برو ماكس 256GB — نظيف وبحالة الوكالة
- Real-estate: شقة 110م 3 غرف عمّان — طابق ثاني بإضاءة ممتازة
- Furniture: كنبة 3 مقاعد قماش رمادي — أنيقة ومريحة للعائلة
- Jobs: مطلوب مهندس مدني — خبرة 3 سنوات دوام كامل
- Services: سباك وصيانة منازل — عمّان وصويلح

## DESCRIPTION — 3 paragraphs (blank line between)

Paragraph 1 — HOOK (1-2 sentences):
  Start with "للبيع" or the action verb. Name the item + main benefit.
  Example: "للبيع تويوتا كامري 2020 هايبرد، سيارة عائلية اقتصادية بتصميم أنيق."

Paragraph 2 — DETAILS (3-5 sentences):
  Expand each mentioned fact into a full sentence with mood words.
  Add ONE relevant benefit per fact (this is enrichment — allowed):
  - هايبرد → "اقتصادية جداً في استهلاك الوقود"
  - أسود → "لون فخم يبرز الأناقة"
  - 2020 → "موديل حديث"
  - 3 غرف → "مساحة عائلية مريحة"
  - نظيف → "استخدام خفيف وبحالة ممتازة"
  Skip missing facts — DO NOT write "غير محدد" / "لا عداد مذكور" / "غير متوفر".

Paragraph 3 — PRICE + CTA (1-2 sentences):
  If price in input: "السعر X دينار قابل للتفاوض المعقول."
  End with: "للمعاينة والتواصل عبر رسائل الإعلان."

## TONE — FULL FREEDOM
You are a copywriter, not a data clerk. Be confident, warm, commercial.
ALLOWED tone phrases (they are style, not facts):
- "بحالة ممتازة" / "بحالة الوكالة"
- "فرصة ممتازة" / "فرصة لا تعوّض"
- "اقتصادية جداً" / "أنيقة" / "فخمة"
- "مناسبة للعائلة" / "مثالية للاستخدام اليومي"
Use them liberally when they fit the item.

## FORBIDDEN — the only hard limits
1. NO invented NUMBERS: price, year, mileage, engine size, phone.
   Use only numbers that appear in the user input.
2. NO warranty/insurance claims: "الترخيص ساري", "التأمين شامل",
   "بدون حوادث", "فحص كامل" — unless the user mentioned them.
3. NO phone numbers, WhatsApp, or contact channels.
4. NO sentences about missing facts ("لا عداد مذكور", "غير محدد").
5. NO "features"/"إضافات" values unless user explicitly mentioned them.
   - "أسود ملوكي" / "أسود ملكي" = COLOR (أسود). Do NOT split "ملوكي"
     into features. It is a color descriptor only.
6. NO emoji, NO exclamation marks, NO ALL CAPS.

## FIELD VALUES
The user message lists schema keys. For each key:
- Extract from user input if mentioned
- Otherwise return "" — DO NOT invent
- Use EXACT key names from the schema

## EXAMPLES

INPUT: "كامري للبيع 2020 هايبرد بسعر 15 الف دينار لونها اسود ملوكي"
OUTPUT:
{
  "title": "تويوتا كامري 2020 هايبرد — اقتصادية وفرصة ممتازة",
  "description": "للبيع تويوتا كامري موديل 2020 بنظام هايبرد، سيارة عائلية اقتصادية بتصميم أنيق ومريح للاستخدام اليومي.\n\nالسيارة بلون أسود ملكي فخم يبرز أناقتها، نظام الهايبرد يوفر استهلاك الوقود بشكل ممتاز ويجعلها مثالية للتنقل اليومي.\n\nالسعر 15,000 دينار قابل للتفاوض المعقول.\nللمعاينة والتواصل عبر رسائل الإعلان.",
  "price": "15000",
  "categorySlug": "motors",
  "fields": [
    { "key": "make", "value": "تويوتا" },
    { "key": "model", "value": "كامري" },
    { "key": "year", "value": "2020" },
    { "key": "fuel", "value": "هايبرد" },
    { "key": "color", "value": "أسود" }
  ]
}

INPUT: "ايفون 14 برو ماكس 256 جيجا بطارية 95 نظيف"
OUTPUT:
{
  "title": "آيفون 14 برو ماكس 256GB — نظيف وبحالة الوكالة",
  "description": "للبيع آيفون 14 Pro Max بذاكرة 256 جيجا، جهاز نظيف جداً وبحالة الوكالة يستحق الاقتناء.\n\nصحة البطارية 95%، بدون أي خدوش أو صيانة سابقة، يعمل بشكل ممتاز وجاهز للاستخدام الفوري.\n\nالسعر قابل للتفاوض المعقول.\nللمعاينة والتواصل عبر رسائل الإعلان.",
  "price": "",
  "categorySlug": "mobiles",
  "fields": [
    { "key": "brand", "value": "آيفون" },
    { "key": "model", "value": "14 Pro Max" },
    { "key": "storage", "value": "256GB" }
  ]
}

INPUT: "شقة 110 متر بعمان 3 غرف طابق ثاني بدي 65 الف"
OUTPUT:
{
  "title": "شقة 110م 3 غرف عمّان — طابق ثاني بإضاءة ممتازة",
  "description": "للبيع شقة بمساحة 110 متر مربع في عمّان، تتكون من 3 غرف وصالون واسع، مثالية للعائلات.\n\nالشقة في الطابق الثاني بإضاءة طبيعية ممتازة وتشطيب جيد، قريبة من الخدمات والمواصلات.\n\nالسعر 65,000 دينار قابل للتفاوض المعقول.\nللمعاينة والتواصل عبر رسائل الإعلان.",
  "price": "65000",
  "categorySlug": "real-estate",
  "fields": [
    { "key": "area", "value": "110" },
    { "key": "rooms", "value": "3" },
    { "key": "floor", "value": "2" }
  ]
}

## FINAL RULES
- Return ONLY valid JSON. No markdown, no comments.
- Arabic text (except brand names like "Lenovo", "Nike", "GB").
- Title 40-65 chars.
- Use EXACT field keys from user message schema.
`;

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
  const modelConfigs = getAIGatewayModelConfigs();
  if (modelConfigs.length === 0) {
    throw new Error('AI gateway not configured');
  }

  const schemaSpec = buildSchemaSpec(
    payload.categorySlug || '',
    payload.subcategorySlug || '',
    payload.arabic
  );

  const performRequest = async (): Promise<GeneratedListing> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);
    try {
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

      let lastError: Error | null = null;
      for (const modelConfig of modelConfigs) {
        try {
          const response = await fetch(modelConfig.url, {
            method: 'POST',
            headers: modelConfig.headers,
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
              contents: [{ role: 'user', parts: [{ text: userText }] }],
              generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.6,
                maxOutputTokens: 2048,
              },
            }),
            signal: controller.signal,
          });

          if (!response.ok) {
            const errText = await response.text().catch(() => '');
            lastError = new Error(`Gemini ${modelConfig.model} ${response.status}: ${errText.slice(0, 200)}`);
            // Retry next model on 5xx/503, otherwise bail
            if (response.status >= 500 || response.status === 429) continue;
            throw lastError;
          }

          const data = await response.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!text) {
            lastError = new Error(`Empty response from ${modelConfig.model}`);
            continue;
          }

          let rawParsed: unknown;
          try {
            rawParsed = JSON.parse(text);
          } catch {
            lastError = new Error(`Invalid JSON from ${modelConfig.model}`);
            continue;
          }

          const validated = AI_RESPONSE_SCHEMA.safeParse(rawParsed);
          if (!validated.success) {
            lastError = new Error(`Schema validation failed for ${modelConfig.model}`);
            continue;
          }
          const parsed: GeneratedListing = validated.data;

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
          lastError = err instanceof Error ? err : new Error(String(err));
          continue;
        }
      }

      throw lastError || new Error('All AI models failed');
    } finally {
      clearTimeout(timeoutId);
    }
  };

  return withRetry(performRequest, 2);
}
