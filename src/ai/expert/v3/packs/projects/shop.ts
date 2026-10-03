import { makePack } from '../factory';

export const shopPack = makePack({
  id: 'projects-shop',
  noun: 'محل تجاري',
  detect: /مشروع محل/,
  allowArea: false,
});
