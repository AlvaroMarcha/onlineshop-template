import { formatDate } from './shared/dates';

describe('formatDate', () => {
  it('should format a date string in Spanish long format', () => {
    const result = formatDate('2024-01-15');
    expect(result).toContain('2024');
    expect(result).toContain('15');
  });

  it('should return a non-empty string', () => {
    const result = formatDate('2024-06-01');
    expect(result.length).toBeGreaterThan(0);
  });
});
