/**
 * Read image dimensions from a File, with graceful fallbacks.
 *
 * Tries in order:
 *   1. createImageBitmap(file) — fastest, widely supported
 *   2. createImageBitmap(file, { imageOrientation: 'from-image' }) — for EXIF
 *   3. HTMLImageElement with object URL — universal fallback
 *
 * Returns null if all three fail. Callers must handle null explicitly;
 * do not silently accept corrupt files.
 */
export async function readImageDimsFromFile(
  file: File,
): Promise<{ width: number; height: number } | null> {
  try {
    const bmp = await createImageBitmap(file);
    const d = { width: bmp.width, height: bmp.height };
    bmp.close();
    if (d.width > 0 && d.height > 0) return d;
  } catch {
    // fall through
  }

  try {
    const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
    const d = { width: bmp.width, height: bmp.height };
    bmp.close();
    if (d.width > 0 && d.height > 0) return d;
  } catch {
    // fall through
  }

  try {
    return await new Promise<{ width: number; height: number } | null>((resolve) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const d = { width: img.naturalWidth, height: img.naturalHeight };
        URL.revokeObjectURL(url);
        resolve(d.width > 0 && d.height > 0 ? d : null);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };
      img.src = url;
    });
  } catch {
    return null;
  }
}
