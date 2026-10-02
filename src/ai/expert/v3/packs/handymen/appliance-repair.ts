import { makePack } from '../factory';

export const appliance_repairPack = makePack({
  id: 'handymen-appliance-repair',
  noun: 'صيانة أجهزة',
  detect: /صيانة غسالة/,
  allowArea: false,
});
