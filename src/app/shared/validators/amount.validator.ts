import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const DECIMAL_AMOUNT_PATTERN = /^\d{1,15}(\.\d{1,2})?$/;
export const MIN_TRANSACTION_AMOUNT = 0.01;

export function amountValidator(maxAmount?: number): ValidatorFn {
  return (control: AbstractControl<number | string | null>): ValidationErrors | null => {
    const rawValue = control.value;
    if (rawValue === null || rawValue === undefined || rawValue === '') {
      return null;
    }

    const normalizedText = String(rawValue).trim();
    if (!DECIMAL_AMOUNT_PATTERN.test(normalizedText)) {
      return { amountFormat: true };
    }

    const numericValue = Number(normalizedText);
    if (!Number.isFinite(numericValue) || numericValue < MIN_TRANSACTION_AMOUNT) {
      return { amountMin: { min: MIN_TRANSACTION_AMOUNT } };
    }

    if (maxAmount !== undefined && numericValue > maxAmount) {
      return { amountMax: { max: maxAmount } };
    }

    return null;
  };
}
