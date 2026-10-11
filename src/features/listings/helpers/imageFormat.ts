/**
 * Image Format Detection — magic-byte sniffing
 *
 * Trusts bytes, not file.type. Mobile Safari and renamed files
 * often report wrong MIME types.
 */
export type ImageFormat = 'jpg' | 'png' | 'webp' | 'gif' | 'avif' | 'heic';

const MAGIC_BYTES_READ = 32;

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
