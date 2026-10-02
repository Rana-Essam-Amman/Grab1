import { makePack } from '../factory';

export const licensesPack = makePack({
  id: 'projects-licenses',
  noun: 'رخصة',
  detect: /رخصة/,
  allowArea: false,
});
