import { describe, it, expect } from 'vitest';
import { formatINR } from '@/lib/format';

describe('formatINR', () => {
  it('formats zero', () => {
    expect(formatINR(0)).toBe('₹0');
  });

  it('formats small value under 1000', () => {
    expect(formatINR(500)).toBe('₹500');
  });

  it('formats value at 1000 boundary', () => {
    expect(formatINR(1000)).toBe('₹1,000');
  });

  it('formats five-digit value with Indian grouping', () => {
    expect(formatINR(35000)).toBe('₹35,000');
  });

  it('formats lakh value', () => {
    expect(formatINR(150000)).toBe('₹1,50,000');
  });

  it('formats crore value', () => {
    expect(formatINR(12500000)).toBe('₹1,25,00,000');
  });

  it('rounds decimal amounts', () => {
    expect(formatINR(1999.7)).toBe('₹2,000');
  });

  it('formats negative value', () => {
    expect(formatINR(-4500)).toBe('-₹4,500');
  });
});
