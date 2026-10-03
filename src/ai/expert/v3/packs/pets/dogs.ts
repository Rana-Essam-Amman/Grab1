import { makePack } from '../factory';

export const dogsPack = makePack({
  id: 'pets-dogs',
  noun: 'كلب',
  detect: /كلب/,
  allowArea: false,
});
