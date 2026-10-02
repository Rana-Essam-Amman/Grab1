import { makePack } from '../factory';

export const instrumentsPack = makePack({
  id: 'books-instruments',
  noun: 'آلة موسيقية',
  detect: /عود|جيتار/,
  allowArea: false,
});
