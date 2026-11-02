import { toast } from 'sonner';
import type { GeoStatus } from '../hooks/useGeoLocation';

export function handleGeoStatusToast(status: GeoStatus, error: string | null, isArabic: boolean): void {
  if (status === 'denied') {
    toast.error(
      isArabic
        ? 'تم رفض صلاحية الوصول للموقع. يرجى تفعيلها من إعدادات المتصفح.'
        : 'Location permission denied. Please enable it in your browser settings.'
    );
  } else if (status === 'unavailable') {
    toast.error(
      isArabic
        ? 'خدمة تحديد الموقع غير متاحة على جهازك.'
        : 'Location service is not available on your device.'
    );
  } else if (status === 'error' && error) {
    toast.error(
      isArabic
        ? 'تعذر تحديد موقعك بدقة. يرجى اختيار المدينة والحي يدوياً.'
        : 'Could not determine your location accurately. Please select manually.'
    );
  }
}
