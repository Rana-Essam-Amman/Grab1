import { describe, it, expect } from 'vitest';
import { buildSchemaSpec } from '../aiGatewayClient';

describe('buildSchemaSpec', () => {
  it('returns full field list for motors (10 fields)', () => {
    const spec = buildSchemaSpec('motors', false);
    expect(spec).toContain('make');
    expect(spec).toContain('model');
    expect(spec).toContain('transmission');
    expect(spec).toContain('fuel');
    expect(spec).toContain('inspection');
    expect(spec).toContain('origin');
    expect(spec).toContain('features');
  });

  it('marks required fields explicitly', () => {
    const spec = buildSchemaSpec('motors', false);
    expect(spec).toMatch(/make \(select\) \(required\): Make/);
  });

  it('includes options for select fields', () => {
    const spec = buildSchemaSpec('motors', false);
    expect(spec).toMatch(/transmission.*one of:/);
  });

  it('uses arabic labels when arabic=true', () => {
    const spec = buildSchemaSpec('motors', true);
    expect(spec).toContain('الماركة');
    expect(spec).toContain('ناقل الحركة');
  });

  it('returns fallback when no schema exists', () => {
    const spec = buildSchemaSpec('unknown-category', false);
    expect(spec).toBe('(no schema — infer from category)');
  });
});
