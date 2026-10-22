import { describe, expect, it } from 'vitest';
import { formatRelativeDate } from '../formatDate';

describe('formatRelativeDate', () => {
  it('formats recent times in minutes, hours, and days in Arabic and English', () => {
    const now = Date.now();
    const fiveMinsAgo = new Date(now - 5 * 60 * 1000).toISOString();
    const twoHoursAgo = new Date(now - 2 * 60 * 60 * 1000).toISOString();
    const threeDaysAgo = new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString();

    expect(formatRelativeDate(fiveMinsAgo, true)).toBe('منذ 5 دقائق');
    expect(formatRelativeDate(fiveMinsAgo, false)).toBe('5m ago');

    expect(formatRelativeDate(twoHoursAgo, true)).toBe('منذ ساعتين');
    expect(formatRelativeDate(twoHoursAgo, false)).toBe('2h ago');

    expect(formatRelativeDate(threeDaysAgo, true)).toBe('منذ 3 أيام');
    expect(formatRelativeDate(threeDaysAgo, false)).toBe('3d ago');
  });

  it('handles empty or invalid date strings', () => {
    expect(formatRelativeDate(null, true)).toBe('');
    expect(formatRelativeDate(undefined, true)).toBe('');
    expect(formatRelativeDate('invalid-date', true)).toBe('');
  });

  it('formats dates older than 30 days as absolute date', () => {
    const oldDate = new Date('2023-01-15T12:00:00Z').toISOString();
    expect(formatRelativeDate(oldDate, false)).toContain('2023');
  });
});
