import { makePack } from '../factory';

export const plantsPack = makePack({
  id: 'home-garden-plants',
  noun: 'نبتة',
  detect: /نبتة|شجرة/,
  allowArea: false,
});
