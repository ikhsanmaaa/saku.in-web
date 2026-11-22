import { JakartaDatePipe } from './jakarta-date.pipe';

describe('JakartaDatePipe', () => {
  const pipe = new JakartaDatePipe();

  it('should convert UTC ISO timestamp to Asia/Jakarta WIB format', () => {
    // 13:21 UTC = 20:21 WIB (+07:00)
    expect(pipe.transform('2026-11-19T13:21:00Z')).toBe('19 Nov 2026, 20:21 WIB');
  });

  it('should handle date rollover across midnight in Asia/Jakarta', () => {
    // 20:30 UTC on Nov 19 = 03:30 WIB on Nov 20
    expect(pipe.transform('2026-11-19T20:30:00Z')).toBe('20 Nov 2026, 03:30 WIB');
  });

  it('should return empty string when input is empty or invalid date', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform('')).toBe('');
    expect(pipe.transform('invalid-date')).toBe('');
  });
});
