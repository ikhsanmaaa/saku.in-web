import { IdrCurrencyPipe } from './idr-currency.pipe';

describe('IdrCurrencyPipe', () => {
  const pipe = new IdrCurrencyPipe();

  it('should format positive integers and decimals in id-ID with 2 decimals', () => {
    expect(pipe.transform(310000)).toBe('Rp 310.000,00');
    expect(pipe.transform(100250.5)).toBe('Rp 100.250,50');
    expect(pipe.transform(0)).toBe('Rp 0,00');
  });

  it('should include plus or minus prefix when showSign is true or value is negative', () => {
    expect(pipe.transform(50000, true)).toBe('+Rp 50.000,00');
    expect(pipe.transform(-25000)).toBe('-Rp 25.000,00');
    expect(pipe.transform(0, true)).toBe('Rp 0,00');
  });

  it('should return empty string when value is null, undefined, or non-numeric', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform('')).toBe('');
    expect(pipe.transform('not-a-number')).toBe('');
  });
});
