import { makePack } from '../factory';

export const bicyclesPack = makePack({
  id: 'sports-bicycles',
  noun: 'دراجة',
  detect: /دراجة هوائية/,
  allowArea: false,
});
