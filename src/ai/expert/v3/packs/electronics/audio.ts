import { makePack } from '../factory';

export const audioPack = makePack({
  id: 'electronics-audio',
  noun: 'جهاز صوت',
  detect: /سماعة|مكبر صوت/,
  allowArea: false,
});
