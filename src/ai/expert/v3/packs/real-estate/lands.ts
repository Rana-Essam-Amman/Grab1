import { makePack } from '../factory';

export const landsPack = makePack({
  id: 'lands',
  noun: 'أرض',
  detect: /ارض|أرض/,
  allowArea: true,
  flags: { إطلالة: /إطلالة|اطلالة/, واجهة: /واجهة/ },
});
