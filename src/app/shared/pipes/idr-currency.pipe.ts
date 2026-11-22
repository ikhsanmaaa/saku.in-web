import { Pipe, PipeTransform } from '@angular/core';

const IDR_FORMATTER = new Intl.NumberFormat('id-ID', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

@Pipe({
  name: 'idrCurrency',
})
export class IdrCurrencyPipe implements PipeTransform {
  transform(value: number | string | null | undefined, showSign = false): string {
    if (value === null || value === undefined || value === '') {
      return '';
    }

    const numericValue = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(numericValue)) {
      return '';
    }

    const formattedNumber = IDR_FORMATTER.format(Math.abs(numericValue));
    if (numericValue < 0) {
      return `-Rp ${formattedNumber}`;
    }
    if (showSign && numericValue > 0) {
      return `+Rp ${formattedNumber}`;
    }
    return `Rp ${formattedNumber}`;
  }
}
