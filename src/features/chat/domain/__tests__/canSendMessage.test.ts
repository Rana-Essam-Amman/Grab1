import { describe, it, expect } from 'vitest';
import { canSendMessage, MAX_BUYER_MESSAGES } from '../rules/canSendMessage';

describe('canSendMessage', () => {
  it('rejects empty messages', () => {
    const result = canSendMessage('', []);
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('empty-message');
  });

  it('rejects whitespace-only messages', () => {
    const result = canSendMessage('   ', []);
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('empty-message');
  });

  it('rejects messages longer than 2000 chars', () => {
    const result = canSendMessage('x'.repeat(2001), []);
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('too-long');
  });

  it('allows first message when no prior messages', () => {
    const result = canSendMessage('hello', []);
    expect(result.allowed).toBe(true);
  });

  it('allows message when buyer has sent fewer than limit', () => {
    const messages = Array.from({ length: 3 }, () => ({ fromBuyer: true }));
    const result = canSendMessage('hello', messages);
    expect(result.allowed).toBe(true);
  });

  it('rejects when buyer has reached the limit', () => {
    const messages = Array.from({ length: MAX_BUYER_MESSAGES }, () => ({
      fromBuyer: true,
    }));
    const result = canSendMessage('hello', messages);
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('quota-exceeded');
  });

  it('does not count seller messages against buyer quota', () => {
    const messages = Array.from({ length: 10 }, () => ({ fromBuyer: false }));
    const result = canSendMessage('hello', messages);
    expect(result.allowed).toBe(true);
  });
});
