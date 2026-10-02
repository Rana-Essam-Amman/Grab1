import { makePack } from '../factory';

export const tutorPack = makePack({
  id: 'services-tutor',
  noun: 'درس',
  detect: /درس خصوصي/,
  allowArea: false,
});
