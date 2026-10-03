import { goodsPack } from '../goods';

export const officeFurniturePack = goodsPack({
  id: 'officeFurniturePack',
  noun: 'أثاث مكتبي',
  detect: /كرسي مكتب|مكتب خشب/,
  brands: [],
});
