// Image Validator — Google-Level Standards. Never trusts file.type.
import { sniffImageFormat, type ImageFormat } from './imageFormat';
import { readImageDimsFromFile } from './readImageDims';

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

/** FOX defaults — aligned with Google Shopping + Dubizzle + Facebook. */
export const DEFAULT_IMAGE_RULES: ImageValidationRules = {
  maxSizeBytes: 5 * 1024 * 1024,
  minWidth: 600,
  minHeight: 600,
  maxPixels: 40_000_000,
  allowedFormats: ['jpg', 'png', 'webp'],
};

export async function validateImage(
  file: File,
  rules: ImageValidationRules = DEFAULT_IMAGE_RULES,
): Promise<ImageValidationResult> {
  if (file.size > rules.maxSizeBytes) {
    const actual = (file.size / 1024 / 1024).toFixed(1);
    const max = (rules.maxSizeBytes / 1024 / 1024).toFixed(1);
    return { ok: false, reason: `حجم الصورة ${actual} ميجا. الحد الأقصى ${max} ميجا.` };
  }

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

  const dims = await readImageDimsFromFile(file);
  if (!dims) {
    return { ok: false, reason: 'تعذّر فك الصورة. الملف قد يكون تالفاً.' };
  }

  const { width, height } = dims;

  if (width * height > rules.maxPixels) {
    const mp = (width * height / 1e6).toFixed(1);
    const maxMp = (rules.maxPixels / 1e6).toFixed(0);
    return { ok: false, reason: `الصورة ${mp} ميجابكسل. الحد الأقصى ${maxMp} ميجابكسل.` };
  }

  if (width < rules.minWidth || height < rules.minHeight) {
    return {
      ok: false,
      reason: `الصورة ${width}×${height}. الحد الأدنى ${rules.minWidth}×${rules.minHeight}.`,
    };
  }

  return { ok: true, width, height, format };
}
