const BANNED = [
  'كما هو موضح',
  'كما هي موصوفة',
  'وفق الوصف',
  'حسب ما ذُكر',
  'حسب ما ذكر',
  'فرصة ذهبية',
  'فرصة مميزة',
  'لا يفوتك',
  'أفضل عرض',
  'سعر مميز',
  'تشطيب فاخر',
  'تشطيبات ممتازة',
  'تصميم عصري',
  'إطلالة جميلة',
  'ديكورات عصرية',
  'موقع استراتيجي',
];

export class GuardError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GuardError';
  }
}

export function assertGuarded(text: string, traced: readonly string[]): void {
  if (text.includes('{') || text.includes('}')) throw new GuardError('unfilled slot');
  const hit = BANNED.find((phrase) => text.includes(phrase));
  if (hit) throw new GuardError(`banned:${hit}`);
  const numbers = text.match(/\d+/g) || [];
  for (const n of numbers) {
    if (!traced.includes(n)) throw new GuardError(`untraced:${n}`);
  }
}
