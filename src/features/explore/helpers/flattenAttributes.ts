export function flattenAttributes(
  fields: readonly { key: string; value: string }[],
  isArabic?: boolean
): string[] {
  void isArabic;
  const out: string[] = [];
  for (const f of fields) {
    const v = (f.value ?? '').trim();
    if (!v) continue;
    out.push(v);
  }
  return out;
}

export function attributesToSearchString(
  fields: readonly { key: string; value: string }[],
  isArabic: boolean
): string {
  return flattenAttributes(fields, isArabic).join(' ');
}
