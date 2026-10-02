import { makePack } from '../factory';

export const softwarePack = makePack({
  id: 'projects-software',
  noun: 'برنامج',
  detect: /برنامج للبيع/,
  allowArea: false,
});
