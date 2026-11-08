const ADMIN_WORDS: ReadonlySet<string> = new Set([
  'لواء',
  'ألوية',
  'الوية',
  'قضاء',
  'قصبة',
  'liwa',
  'liwas',
  'qada',
  'qasabah',
]);

export function stripAdminWords(label: string): string {
  const result = label
    .split(/\s+/)
    .filter(token => !ADMIN_WORDS.has(token.toLowerCase()))
    .join(' ')
    .trim();

  return result || label;
}
