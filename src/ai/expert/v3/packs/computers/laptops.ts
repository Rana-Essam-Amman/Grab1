import { makePack } from '../factory';

export const laptopsPack = makePack({
  id: 'computers-laptops',
  noun: 'لابتوب',
  detect: /لابتوب|لابتوب/,
  allowArea: false,
});
