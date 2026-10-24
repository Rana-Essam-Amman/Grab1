import { FormattedPhone } from '@/shared/lib/phoneFormatting';
import { WhatsAppIntent } from '../helpers/whatsappIntents';
import { Listing } from '@/types';
import { ScreenType } from '@/store/ui.slice';

export interface UseListingDetailReturn {
  listing: Listing | null; activeCountry: string; isCountryMismatch: boolean;
  sanitizedLoc: { city: string; neighborhood: string }; locationText: string;
  mapUrl: string; displayCurrency: string; images: string[]; mapQuery: string;
  formattedPhone: FormattedPhone; activePhotoIdx: number; setActivePhotoIdx: (idx: number) => void;
  showShare: boolean; setShowShare: (v: boolean) => void; showReport: boolean; setShowReport: (v: boolean) => void; showWhatsAppSheet: boolean; setShowWhatsAppSheet: (v: boolean) => void;
  handleStartChat: () => void | Promise<void>; handleCall: () => void | Promise<void>; handleWhatsApp: () => void | Promise<void>;
  handleWhatsAppClick: () => void; handleWhatsAppIntent: (intent: WhatsAppIntent) => void;
  handleDelete: () => Promise<void>; handleEdit: () => void; handleSelectSeller: () => void; isAuthenticated: boolean; isDeleting: boolean;
  isOwner: boolean; isArabic: boolean; goBack: () => void; navigateTo: (screen: ScreenType) => void; isRevealingPhone: boolean;
}
