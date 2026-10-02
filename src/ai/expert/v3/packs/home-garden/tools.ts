import { makePack } from '../factory';

export const toolsPack = makePack({
  id: 'home-garden-tools',
  noun: 'أداة',
  detect: /أداة حديقة/,
  allowArea: false,
});
