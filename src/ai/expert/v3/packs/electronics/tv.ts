import { goodsPack } from '../goods';

export const tvPack = goodsPack({
  id: 'tvPack',
  noun: 'تلفزيون',
  detect: /تلفزيون|تلفاز/,
  brands: ['سامسونج','ال جي'],
});
