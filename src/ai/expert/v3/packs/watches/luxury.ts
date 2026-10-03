import { goodsPack } from '../goods';

export const luxuryWatchPack = goodsPack({
  id: 'luxuryWatchPack',
  noun: 'ساعة فاخرة',
  detect: /رولكس|ساعة فاخرة/,
  brands: ['رولكس'],
});
