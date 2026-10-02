import { makePack } from '../factory';

export const agriPack = makePack({
  id: 'projects-agri',
  noun: 'مشروع زراعي',
  detect: /مشروع زراعي/,
  allowArea: false,
});
