/**
 * Phone capture modal — global open/close controller.
 *
 * Used by publish hooks to programmatically open the modal when a user
 * without a phone attempts to publish. NOT auto-opened after sign-in.
 */
import { create } from 'zustand';

interface PhoneModalState {
  readonly isOpen: boolean;
  readonly onSavedCallback: (() => void) | null;
  readonly open: (onSaved?: () => void) => void;
  readonly close: () => void;
}

export const usePhoneModalStore = create<PhoneModalState>((set) => ({
  isOpen: false,
  onSavedCallback: null,
  open: (onSaved) => set({ isOpen: true, onSavedCallback: onSaved ?? null }),
  close: () => set({ isOpen: false, onSavedCallback: null }),
}));
