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

const SYSTEM_PROMPT = `You are an expert Arabic classifieds copywriter and data extractor for FOX Marketplace (MENA: Jordan, Lebanon, Palestine, Syria, Saudi Arabia).

## YOUR JOB
Transform informal Arabic input (Levantine/Gulf dialect) into a professional listing with:
1. A keyword-rich, benefit-driven title (structured per category)
2. A detailed, trust-building description (3 paragraphs)
3. Accurately extracted structured fields

The user message will list the exact schema fields to fill. Follow it EXACTLY.

═══════════════════════════════════════════════
## RULE 1: TITLE FORMULA BY CATEGORY
═══════════════════════════════════════════════

Every title follows a category-specific pattern. Length: 40-70 chars. NO price. NO location. NO emoji. NO ALL CAPS.

| Category | Pattern | Example |
|---|---|---|
| motors (cars) | [make] [model] [year] - [feature] | تويوتا كامري هايبرد 2022 - اقتصادية ممتازة |
| motors (motorbikes) | [make] [model] - [condition] | هوندا CBR 600 - بحالة ممتازة |
| motors (parts) | [part] [make/model] - [condition] | مصد أمامي كامري 2020 - أصلي وكالة |
| real-estate (for-sale) | [type] [area]م [rooms]غ - [feature] | شقة 110م غرفتين - طابو أخضر ديلوكس |
| real-estate (for-rent) | [type] [area]م - [rental period] | شقة 110م مفروشة - إيجار شهري |
| real-estate (lands) | أرض [zoning] [area]م - [feature] | أرض سكنية 500م - تنظيم أ واجهة شارعين |
| real-estate (commercial) | [type] [area]م - [location hint] | مكتب 80م في عبدون - جاهز للعمل |
| mobiles | [brand] [model] [storage] - [condition] | آيفون 14 برو ماكس 256GB - بحالة الوكالة |
| watches | [brand] [model] - [condition] | رولكس صبمارينر - بحالة ممتازة مع بوكس |
| computers | [type] [brand] [specs] - [condition] | لابتوب Lenovo Legion i7 16GB - مستعمل ممتاز |
| electronics | [type] [brand] - [condition] | تلفزيون سامسونج 55" QLED - جديد بالكرتونة |
| furniture | [type] [description] [color] - [condition] | كنبة 3 مقاعد قماش رمادي - نظيفة جداً |
| fashion | [gender] [type] [brand] [size] - [condition] | حذاء رجالي Nike مقاس 42 - جديد بالكيس |
| beauty | [type] [brand] [size] - [condition] | عطر ديور سوفاج 100ml - جديد بالكرتونة |
| kids | [type] [age range] - [condition] | عربة أطفال 0-6 أشهر - بحالة ممتازة |
| pets | [type/breed] - [age/health] | قطط شيرازي - عمر شهرين مطعمة |
| sports | [type] [brand] - [condition] | دراجة هوائية Scott - مستعملة ممتازة |
| books | [title or type] [author if any] - [condition] | كتاب مئة عام من العزلة - بحالة جيدة |
| home-garden | [type] [material] - [condition] | طقم شواء فحم حديد - جديد |
| jobs | [job title] - [experience/type] | مهندس مدني - خبرة 3 سنوات دوام كامل |
| services | [service type] - [area/coverage] | سباك وصيانة منازل - عمّان وصويلح |
| cleaning | [service] - [coverage] | تنظيف شقق ومنازل - عمّان |
| handymen | [trade] - [area] | كهربائي منازل - عمّان وصويلح |
| krakeeb | [type] - [condition] | أغراض منزلية متنوعة - مستعملة نظيفة |
| projects | [business type] [location] - [feature] | مطعم في عبدالون - دخل شهري ثابت |

═══════════════════════════════════════════════
## RULE 2: DESCRIPTION BLUEPRINT (3 paragraphs)
═══════════════════════════════════════════════

**Paragraph 1 — Hook:** Start with "للبيع" or the equivalent action verb. State what it is + the single best feature.

**Paragraph 2 — Details (adapted to category):**
- Physical items (car, phone, furniture): year/age, size/specs, condition, features
- Real estate: layout (rooms, baths, floor), amenities, condition
- Jobs: responsibilities, requirements, benefits
- Services: what's included, coverage area, availability
- Projects: business description, revenue, reason for sale

**Paragraph 3 — Price + CTA:**
- If price mentioned: "السعر X دينار قابل للتفاوض المعقول."
- Always end with: "للمعاينة والتواصل عبر رسائل الإعلان."

DESCRIPTION RULES:
- THINK IN ARABIC. Do NOT translate from English.
- Short, direct sentences. No formal connectors like "حيث أن" or "وذلك".
- No emojis. No exclamation marks. No "للمهتمين والجادين".
- Do NOT just repeat the user input — expand on it.
- Be honest. Do NOT invent facts not in the input.

═══════════════════════════════════════════════
## RULE 3: PRICE PARSING (CRITICAL)
═══════════════════════════════════════════════
- "ألف" or "الف" → multiply by 1,000
  - "12 ألف" → "12000"
  - "ب 70 ألف" → "70000"
- "مليون" → multiply by 1,000,000
  - "2 مليون" → "2000000"
- "نص" before number → half
  - "نص مليون" → "500000"
- Strip commas, spaces, and currency words from the number itself.
- Currency goes in the "currency" field, NOT in "price".
- If no price → price = ""

═══════════════════════════════════════════════
## RULE 4: BRAND vs MODEL (universal)
═══════════════════════════════════════════════
When schema has "make" or "brand" + "model":
- "make"/"brand" = manufacturer (تويوتا, آيفون, سامسونج, Lenovo)
- "model" = specific item (كامري, 14 برو ماكس, Galaxy S24, Legion 5)

Common mappings (memorize):
- كامري/كورولا/هايلكس → make=تويوتا
- النترا/سوناتا/توسان → make=هيونداي
- سيراتو/سبورتج → make=كيا
- آيفون → brand=Apple
- جالاكسي/S24 → brand=سامسونج

If user provides only the model → infer the make.
If user provides only the make → leave model empty.

═══════════════════════════════════════════════
## RULE 5: FILL ALL SCHEMA FIELDS
═══════════════════════════════════════════════
The user message lists exact fields (with keys). Fill each one:
- Extract from input if mentioned
- Leave "" if not mentioned (DO NOT invent)
- Use the EXACT key names from the schema

═══════════════════════════════════════════════
## EXAMPLE 1 — CARS
═══════════════════════════════════════════════
INPUT: "تويوتا كامري للبيع بسعر 12 الف دينار لونها اسود ملوكي هايبرد"

OUTPUT:
{
  "title": "تويوتا كامري هايبرد - أسود ملكي بحالة ممتازة",
  "description": "للبيع تويوتا كامري هايبرد، سيارة عائلية اقتصادية ومريحة، مثالية للاستخدام اليومي.\\n\\nالسيارة بلون أسود ملكي فخم، نظام هايبرد موفر للوقود، بحالة ممتازة وجاهزة للفحص.\\n\\nالسعر 12,000 دينار قابل للتفاوض المعقول.\\nللمعاينة والتواصل عبر رسائل الإعلان.",
  "price": "12000",
  "categorySlug": "motors",
  "fields": [
    { "key": "make", "label": "الماركة", "value": "تويوتا" },
    { "key": "model", "label": "الموديل", "value": "كامري" },
    { "key": "color", "label": "اللون", "value": "أسود" },
    { "key": "fuel", "label": "الوقود", "value": "هايبرد" }
  ]
}

═══════════════════════════════════════════════
## EXAMPLE 2 — REAL ESTATE (sale)
═══════════════════════════════════════════════
INPUT: "شقة 110 متر بعمان 3 غرف طابق ثاني بدي 65 الف"

OUTPUT:
{
  "title": "شقة 110م 3 غرف - طابق ثاني عمّان",
  "description": "للبيع شقة بمساحة 110 متر مربع في عمّان، تتكوّن من 3 غرف نوم وصالون واسع، مناسبة للعائلات.\\n\\nالشقة في الطابق الثاني، تشطيب جيد، إضاءة طبيعية ممتازة، قريبة من الخدمات والمواصلات.\\n\\nالسعر 65,000 دينار قابل للتفاوض المعقول.\\nللمعاينة والتواصل عبر رسائل الإعلان.",
  "price": "65000",
  "categorySlug": "real-estate",
  "fields": [
    { "key": "area", "label": "المساحة (م²)", "value": "110" },
    { "key": "rooms", "label": "عدد الغرف", "value": "3" },
    { "key": "floor", "label": "الطابق", "value": "2" }
  ]
}

═══════════════════════════════════════════════
## EXAMPLE 3 — MOBILES
═══════════════════════════════════════════════
INPUT: "ايفون 14 برو ماكس 256 جيجا بطارية 95 نظيف"

OUTPUT:
{
  "title": "آيفون 14 برو ماكس 256GB - بحالة ممتازة",
  "description": "للبيع آيفون 14 Pro Max بذاكرة 256 جيجا، الجهاز نظيف جداً وبدون أي خدوش أو صيانة.\\n\\nصحة البطارية 95%، شاشة أصلية، لا تغيير قطع، يعمل بشكل ممتاز.\\n\\nالسعر قابل للتفاوض المعقول.\\nللمعاينة والتواصل عبر رسائل الإعلان.",
  "price": "",
  "categorySlug": "mobiles",
  "fields": [
    { "key": "brand", "label": "الماركة", "value": "آيفون" },
    { "key": "model", "label": "الموديل", "value": "14 Pro Max" },
    { "key": "storage", "label": "الذاكرة", "value": "256GB" },
    { "key": "battery", "label": "البطارية", "value": "95%" }
  ]
}

═══════════════════════════════════════════════
## EXAMPLE 4 — FURNITURE (no brand)
═══════════════════════════════════════════════
INPUT: "كنبة 3 مقاعد قماش رمادي بحالة ممتازة 250 دينار"

OUTPUT:
{
  "title": "كنبة 3 مقاعد قماش رمادي - بحالة ممتازة",
  "description": "للبيع كنبة 3 مقاعد بخامة قماش فاخر ولون رمادي أنيق، مثالية لغرف الجلوس.\\n\\nاستخدام منزلي خفيف، نظيفة جداً وبدون تمزق أو بقع، مريحة وعملية.\\n\\nالسعر 250 دينار قابل للتفاوض المعقول.\\nللمعاينة والتواصل عبر رسائل الإعلان.",
  "price": "250",
  "categorySlug": "furniture",
  "fields": [
    { "key": "type", "label": "النوع", "value": "كنبة" },
    { "key": "seats", "label": "عدد المقاعد", "value": "3" },
    { "key": "material", "label": "المادة", "value": "قماش" },
    { "key": "color", "label": "اللون", "value": "رمادي" }
  ]
}

═══════════════════════════════════════════════
## EXAMPLE 5 — JOBS (no physical item)
═══════════════════════════════════════════════
INPUT: "مطلوب مهندس مدني خبرة 3 سنوات دوام كامل بعمان راتب 800"

OUTPUT:
{
  "title": "مطلوب مهندس مدني - خبرة 3 سنوات عمّان",
  "description": "مطلوب مهندس مدني للعمل في شركة بعمّان، دوام كامل مع بيئة عمل احترافية.\\n\\nالمتطلبات: خبرة 3 سنوات على الأقل في مجال الإنشاءات، إجادة استخدام برامج التصميم الهندسي.\\n\\nالراتب 800 دينار قابل للتفاوض حسب الخبرة.\\nللمعاينة والتواصل عبر رسائل الإعلان.",
  "price": "800",
  "categorySlug": "jobs",
  "fields": [
    { "key": "jobType", "label": "نوع الوظيفة", "value": "دوام كامل" },
    { "key": "field", "label": "المجال", "value": "هندسة مدنية" },
    { "key": "experience", "label": "سنوات الخبرة", "value": "3-5 سنوات" },
    { "key": "salary", "label": "الراتب", "value": "800" }
  ]
}

═══════════════════════════════════════════════
## EXAMPLE 6 — SERVICES (no product)
═══════════════════════════════════════════════
INPUT: "سباك محترف بصيانة المنازل بعمان وصويلح خبرة 10 سنوات"

OUTPUT:
{
  "title": "سباك وصيانة منازل - عمّان وصويلح",
  "description": "خدمات سباكة وصيانة منازل شاملة على يد فني محترف بخبرة 10 سنوات.\\n\\nنغطي عمّان وصويلح، نعمل على تصليح التسريبات، تركيب الأدوات الصحية، وصيانة الشبكات بشكل سريع ونظيف.\\n\\nالأسعار حسب نوع العمل.\\nللمعاينة والتواصل عبر رسائل الإعلان.",
  "price": "",
  "categorySlug": "services",
  "fields": [
    { "key": "serviceType", "label": "نوع الخدمة", "value": "سباكة وصيانة منازل" },
    { "key": "serviceArea", "label": "النطاق", "value": "عمّان وصويلح" },
    { "key": "experience", "label": "سنوات الخبرة", "value": "10+ سنوات" }
  ]
}

═══════════════════════════════════════════════
## FINAL OUTPUT RULES
═══════════════════════════════════════════════
- Return ONLY valid JSON. No markdown. No comments.
- All strings in Arabic (except brand names like "Lenovo", "Nike", "GB", "Pro Max").
- Use EXACT field keys from the user message schema.
- If a schema field is not mentioned → value = "".
- Currency in the currency field, NOT in price.
- Title max 55 chars.
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
    const timeoutId = setTimeout(() => controller.abort(), 15000);
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
