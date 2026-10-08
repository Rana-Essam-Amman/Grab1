const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** True if `value` is a canonical UUID (8-4-4-4-12 hex). */
export function isUuid(value: string | null | undefined): boolean {
  if (!value) return false;
  return UUID_RE.test(value);
}
