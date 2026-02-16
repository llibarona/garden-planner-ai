import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility', () => {
  it('should merge class names', () => {
    const result = cn('foo', 'bar');
    expect(result).toBe('foo bar');
  });

  it('should handle conditional classes', () => {
    const result = cn('foo', false && 'bar', 'baz');
    expect(result).toBe('foo baz');
  });

  it('should handle array input', () => {
    const result = cn(['foo', 'bar', false && 'baz']);
    expect(result).toBe('foo bar');
  });

  it('should handle object input', () => {
    const result = cn('foo', { bar: true, baz: false });
    expect(result).toBe('foo bar');
  });

  it('should handle empty input', () => {
    const result = cn();
    expect(result).toBe('');
  });
});
