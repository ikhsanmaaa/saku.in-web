import { FormControl } from '@angular/forms';
import { amountValidator } from './amount.validator';

describe('amountValidator', () => {
  it('should reject 0 and accept minimum boundary 0.01', () => {
    const zeroControl = new FormControl<string | number>(0, {
      nonNullable: true,
      validators: [amountValidator(10_000_000)],
    });
    const minControl = new FormControl<string | number>(0.01, {
      nonNullable: true,
      validators: [amountValidator(10_000_000)],
    });

    expect(zeroControl.errors).toEqual({ amountMin: { min: 0.01 } });
    expect(minControl.valid).toBe(true);
  });

  it('should accept max boundary 10000000 and reject 10000000.01', () => {
    const maxControl = new FormControl<string | number>(10_000_000, {
      nonNullable: true,
      validators: [amountValidator(10_000_000)],
    });
    const overMaxControl = new FormControl<string | number>(10_000_000.01, {
      nonNullable: true,
      validators: [amountValidator(10_000_000)],
    });

    expect(maxControl.valid).toBe(true);
    expect(overMaxControl.errors).toEqual({ amountMax: { max: 10_000_000 } });
  });

  it('should reject more than 2 decimal places or negative values', () => {
    const threeDecimalsControl = new FormControl<string | number>('100.123', {
      nonNullable: true,
      validators: [amountValidator()],
    });
    const negativeControl = new FormControl<string | number>('-50', {
      nonNullable: true,
      validators: [amountValidator()],
    });

    expect(threeDecimalsControl.errors).toEqual({ amountFormat: true });
    expect(negativeControl.errors).toEqual({ amountFormat: true });
  });
});
