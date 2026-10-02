import { goodsPack } from '../goods';

export const gamingPack = goodsPack({
  id: 'gamingPack',
  noun: 'جهاز ألعاب',
  detect: /بلايستيشن|قيمنق/,
  brands: [],
});
