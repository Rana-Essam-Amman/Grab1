import { goodsPack } from '../goods';

export const audioPack = goodsPack({
  id: 'audioPack',
  noun: 'جهاز صوت',
  detect: /سماعة|مكبر/,
  brands: [],
});
