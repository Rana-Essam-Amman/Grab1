import { makePack } from '../factory';

export const hairPack = makePack({
  id: 'beauty-hair',
  noun: 'عناية شعر',
  detect: /شامبو|شعر/,
  allowArea: false,
});
