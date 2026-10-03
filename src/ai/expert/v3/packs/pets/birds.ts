import { makePack } from '../factory';

export const birdsPack = makePack({
  id: 'pets-birds',
  noun: 'طير',
  detect: /طير|ببغاء/,
  allowArea: false,
});
