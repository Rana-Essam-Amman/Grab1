/**
 * Client-side image compression using Canvas API.
 * Reduces 5MB phone photos to ~300KB without visible quality loss.
 * Skips when input is small (< 500KB) or SVG/GIF.
 */

import {
  fileToDataUrl,
  loadBitmap,
  fitWithin,
  estimateDataUrlBytes,
} from './imageUtils';

const MAX_DIMENSION = 1920;
const JPEG_QUALITY = 0.85;
const SKIP_THRESHOLD_BYTES = 500 * 1024;

export interface CompressResult {
  readonly dataUrl: string;
  readonly originalBytes: number;
  readonly compressedBytes: number;
  readonly ratio: number;
}

export async function compressImage(file: File): Promise<CompressResult> {
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    const dataUrl = await fileToDataUrl(file);
    return { dataUrl, originalBytes: file.size, compressedBytes: file.size, ratio: 1 };
  }

  if (file.size < SKIP_THRESHOLD_BYTES) {
    const dataUrl = await fileToDataUrl(file);
    return { dataUrl, originalBytes: file.size, compressedBytes: file.size, ratio: 1 };
  }

  try {
    const bitmap = await loadBitmap(file);
    const { width, height } = fitWithin(bitmap.width, bitmap.height, MAX_DIMENSION);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('canvas 2d context unavailable');

    ctx.drawImage(bitmap, 0, 0, width, height);

    const compressedDataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
    const compressedBytes = estimateDataUrlBytes(compressedDataUrl);

    if (compressedBytes >= file.size) {
      const dataUrl = await fileToDataUrl(file);
      return { dataUrl, originalBytes: file.size, compressedBytes: file.size, ratio: 1 };
    }

    return {
      dataUrl: compressedDataUrl,
      originalBytes: file.size,
      compressedBytes,
      ratio: compressedBytes / file.size,
    };
  } catch {
    // Any error → fall back to raw file (no error param, no unused warning)
    const dataUrl = await fileToDataUrl(file);
    return { dataUrl, originalBytes: file.size, compressedBytes: file.size, ratio: 1 };
  }
}
