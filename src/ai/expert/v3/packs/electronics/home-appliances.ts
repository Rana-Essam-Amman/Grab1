import { makePack } from '../factory';

export const home_appliancesPack = makePack({
  id: 'electronics-home-appliances',
  noun: 'جهاز منزلي',
  detect: /غسالة|براد|ثلاجة/,
  allowArea: false,
});
