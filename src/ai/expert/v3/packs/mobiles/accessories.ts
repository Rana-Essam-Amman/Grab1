import { goodsPack } from '../goods';

export const mobileAccPack = goodsPack({
  id: 'mobileAccPack',
  noun: 'إكسسوار جوال',
  detect: /كفر|شاحن|سماعة/,
  brands: [],
});
