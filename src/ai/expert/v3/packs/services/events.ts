import { makePack } from '../factory';

export const eventsPack = makePack({
  id: 'services-events',
  noun: 'تنظيم مناسبة',
  detect: /تنظيم حفل/,
  allowArea: false,
});
