import { makePack } from '../factory';

export const smartWatchesPack = makePack({
  id: 'smartWatchesPack',
  noun: 'ساعة ذكية',
  detect: /ساعة ذكية/,
  allowArea: false,
});
