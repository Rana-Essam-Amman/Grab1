export const IMAGE_CONFIG = {
  maxInputSizeMB: 5,
  maxOutputSizeKB: 100,
  maxDimension: 256,
  quality: 0.6,
  acceptedTypes: ['image/jpeg', 'image/png', 'image/webp'],
};

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!IMAGE_CONFIG.acceptedTypes.includes(file.type)) {
    return { valid: false, error: 'invalid_type' };
  }
  if (file.size > IMAGE_CONFIG.maxInputSizeMB * 1024 * 1024) {
    return { valid: false, error: 'too_large' };
  }
  return { valid: true };
}

export async function compressImageToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > height && width > IMAGE_CONFIG.maxDimension) {
          height = (height * IMAGE_CONFIG.maxDimension) / width;
          width = IMAGE_CONFIG.maxDimension;
        } else if (height > IMAGE_CONFIG.maxDimension) {
          width = (width * IMAGE_CONFIG.maxDimension) / height;
          height = IMAGE_CONFIG.maxDimension;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('canvas_context_failed'));
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', IMAGE_CONFIG.quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('image_load_failed'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('file_read_failed'));
    reader.readAsDataURL(file);
  });
}
