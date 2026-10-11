/**
 * Image Validator — Google-Level Standards
 *
 * Validates user-uploaded images BEFORE upload.
 *
 * Key principles (from Google/Amazon/Meta image pipelines):
 * 1. Never trust file.type — sniff magic bytes instead.
 * 2. Never trust file.size alone — decode dimensions with a megapixel budget.
 * 3. Fail loud, not silent — return structured reason, never null.
 * 4. Order checks cheap → expensive: size → format → decode → dimensions.
 *
 * References:
 * - https://github.com/Araluma/safe-image-decode (magic-byte sniffing)
 * - https://js-form-validation.com/validating-image-dimensions-client-side/
 * - Google Shopping image requirements: ≤5MB, JPG/PNG/WebP, ≥600×600
 */

export type ImageFormat = 'jpg' | 'png' | 'webp' | 'gif' | 'avif' | 'heic';

export interface ImageValidationRules {
  readonly maxSizeBytes: number;
  readonly minWidth: number;
  readonly minHeight: number;
  readonly maxPixels: number;
  readonly allowedFormats: readonly ImageFormat[];
}

export interface ImageValidationResult {
  readonly ok: boolean;
  readonly reason?: string;
  readonly width?: number;
  readonly height?: number;
  readonly format?: ImageFormat;
}

/** FOX defaults — aligned with Google Shopping + Dubizzle + Facebook Marketplace. */
export const DEFAULT_IMAGE_RULES: ImageValidationRules = {
  maxSizeBytes: 5 * 1024 * 1024, // 5 MB (Google + Dubizzle)
  minWidth: 600, // Facebook Marketplace minimum
  minHeight: 600,
  maxPixels: 40_000_000, // 40 MP — prevents tab freeze on 200 MP scans
  allowedFormats: ['jpg', 'png', 'webp'],
};

const MAGIC_BYTES_READ = 32;

/**
 * Sniff the real image format from the leading bytes.
 *
 * Why: mobile Safari treats `accept=` as a hint, and `file.type` is empty
 * or wrong on renamed files. The only authoritative signal is the bytes.
 *
 * Recognizes: JPEG, PNG, WebP, GIF, AVIF, HEIC/HEIF.
 * Returns null if none match.
 */
export async function sniffImageFormat(file: File): Promise<ImageFormat | null> {
  const buffer = await file.slice(0, MAGIC_BYTES_READ).arrayBuffer();
  const b = new Uint8Array(buffer);

  // JPEG: FF D8
  if (b[0] === 0xff && b[1] === 0xd8) return 'jpg';

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 &&
    b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a
  ) return 'png';

  // WebP: RIFF....WEBP
  if (
    b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
    b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50
  ) return 'webp';

  // GIF: GIF87a / GIF89a
  if (
    b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38 &&
    (b[4] === 0x37 || b[4] === 0x39) && b[5] === 0x61
  ) return 'gif';

  // AVIF / HEIC: ....ftyp<brand>
  if (b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70) {
    const brand = String.fromCharCode(b[8], b[9], b[10], b[11]);
    if (brand === 'avif') return 'avif';
    if (brand === 'heic' || brand === 'heix' || brand === 'hevc') return 'heic';
  }

  return null;
}

/**
 * Validate an image file. Returns a structured result — never throws.
 *
 * Order: size → format → decode → pixels → dimensions.
 */
export async function validateImage(
  file: File,
  rules: ImageValidationRules = DEFAULT_IMAGE_RULES,
): Promise<ImageValidationResult> {
  // 1. Cheap: file size
  if (file.size > rules.maxSizeBytes) {
    const actual = (file.size / 1024 / 1024).toFixed(1);
    const max = (rules.maxSizeBytes / 1024 / 1024).toFixed(1);
    return { ok: false, reason: `حجم الصورة ${actual} ميجا. الحد الأقصى ${max} ميجا.` };
  }

  // 2. Cheap: magic-byte format
  const format = await sniffImageFormat(file);
  if (!format) {
    return { ok: false, reason: 'الملف مو صورة صالحة (فشل فحص البايتات).' };
  }
  if (!rules.allowedFormats.includes(format)) {
    return {
      ok: false,
      reason: `صيغة "${format}" غير مدعومة. المسموح: ${rules.allowedFormats.join(', ')}.`,
    };
  }

  // 3. Expensive: decode with EXIF rotation
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    return { ok: false, reason: 'تعذّر فك الصورة. الملف قد يكون تالفاً.' };
  }

  try {
    const { width, height } = bitmap;

    // 4. Pixel budget — prevents main-thread freeze
    if (width * height > rules.maxPixels) {
      const mp = (width * height / 1e6).toFixed(1);
      const maxMp = (rules.maxPixels / 1e6).toFixed(0);
      return { ok: false, reason: `الصورة ${mp} ميجابكسل. الحد الأقصى ${maxMp} ميجابكسل.` };
    }

    // 5. Minimum dimensions
    if (width < rules.minWidth || height < rules.minHeight) {
      return {
        ok: false,
        reason: `الصورة ${width}×${height}. الحد الأدنى ${rules.minWidth}×${rules.minHeight}.`,
      };
    }

    return { ok: true, width, height, format };
  } finally {
    bitmap.close();
  }
}
