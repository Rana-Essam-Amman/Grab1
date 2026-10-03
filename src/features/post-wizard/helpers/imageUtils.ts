/**
 * Image utility helpers — file reading, sizing, byte estimation.
 * No canvas or compression logic here.
 */

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') resolve(result);
      else reject(new Error('FileReader returned non-string'));
    };
    reader.onerror = () => reject(new Error('FileReader error'));
    reader.readAsDataURL(file);
  });
}

export async function loadBitmap(file: File): Promise<ImageBitmap> {
  return await createImageBitmap(file);
}

export function fitWithin(
  width: number,
  height: number,
  max: number
): { width: number; height: number } {
  if (width <= max && height <= max) return { width, height };
  if (width >= height) {
    return { width: max, height: Math.round((height * max) / width) };
  }
  return { width: Math.round((width * max) / height), height: max };
}

export function estimateDataUrlBytes(dataUrl: string): number {
  const base64 = dataUrl.split(',')[1] || '';
  return Math.floor((base64.length * 3) / 4);
}
