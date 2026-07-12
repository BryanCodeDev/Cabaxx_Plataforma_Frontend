import { describe, it, expect } from 'vitest';
import { formatCOP, formatNumber, formatDate } from '@/utils/format';

describe('format utilities', () => {
  it('formats COP currency', () => {
    expect(formatCOP(1500000)).toBe('$1.500.000');
  });

  it('formats large numbers', () => {
    expect(formatNumber(1500000)).toBe('1.5M');
    expect(formatNumber(45000)).toBe('45K');
    expect(formatNumber(500)).toBe('500');
  });

  it('formats dates in Spanish', () => {
    const d = new Date('2026-07-10T20:00:00');
    const result = formatDate(d);
    expect(result).toContain('2026');
    expect(result).toContain('jul');
  });
});
