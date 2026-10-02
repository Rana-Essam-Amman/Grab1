import { goodsPack } from '../goods';

export const pcAccPack = goodsPack({
  id: 'pcAccPack',
  noun: 'إكسسوار كمبيوتر',
  detect: /ماوس|كيبورد/,
  brands: [],
});
