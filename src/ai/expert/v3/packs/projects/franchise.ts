import { makePack } from '../factory';

export const franchisePack = makePack({
  id: 'projects-franchise',
  noun: 'امتياز',
  detect: /امتياز|فرنشايز/,
  allowArea: false,
});
