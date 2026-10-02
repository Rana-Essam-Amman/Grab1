import { goodsPack } from '../goods';

export const feedingPack = goodsPack({
  id: 'feedingPack',
  noun: 'مستلزم رضاعة',
  detect: /رضاعة/,
  brands: [],
});
