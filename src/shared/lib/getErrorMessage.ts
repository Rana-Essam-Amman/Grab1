/**
 * Safely extracts a human-readable error message from an unknown value.
 * Handles: Error instances, plain objects with a string `message` property
 * (e.g., Supabase PostgrestError), plain strings, and arbitrary values.
 */
export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    return err.message || 'Unknown error';
  }
  if (typeof err === 'object' && err !== null) {
    const candidate = err as { message?: unknown };
    if (typeof candidate.message === 'string' && candidate.message.length > 0) {
      return candidate.message;
    }
  }
  if (typeof err === 'string' && err.length > 0) {
    return err;
  }
  return 'An unexpected error occurred';
}
