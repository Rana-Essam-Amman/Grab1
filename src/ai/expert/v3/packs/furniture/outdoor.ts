import { goodsPack } from '../goods';

export const outdoorPack = goodsPack({
  id: 'outdoorPack',
  noun: 'أثاث خارجي',
  detect: /أثاث حديقة|جلسات خارجية/,
  brands: [],
});
