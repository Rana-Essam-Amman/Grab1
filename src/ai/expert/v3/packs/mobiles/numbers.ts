import { makePack } from '../factory';

export const numbersPack = makePack({
  id: 'numbersPack',
  noun: 'رقم',
  detect: /رقم مميز/,
  allowArea: false,
});
