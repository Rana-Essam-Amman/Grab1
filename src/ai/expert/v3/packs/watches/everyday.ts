import { goodsPack } from '../goods';

export const everydayWatchPack = goodsPack({
  id: 'everydayWatchPack',
  noun: 'ساعة',
  detect: /ساعة/,
  brands: ['كاسيو'],
});
