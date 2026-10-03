import { makePack } from '../factory';

export const online_storePack = makePack({
  id: 'projects-online-store',
  noun: 'متجر',
  detect: /متجر إلكتروني/,
  allowArea: false,
});
