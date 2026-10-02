import { goodsPack } from '../goods';

export const smartWatchesPack = goodsPack({
  id: 'smartWatchesPack',
  noun: 'ساعة ذكية',
  detect: /ساعة ذكية|ابل ووتش/,
  brands: ['أبل','سامسونج'],
});
