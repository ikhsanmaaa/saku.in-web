import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const MILLISECONDS_PER_DAY = 86_400_000;

function parseUtcMidnight(dateText: string): number | null {
  const match = ISO_DATE_PATTERN.exec(dateText.trim());
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  const day = Number(match[3]);
  const utcTimestamp = Date.UTC(year, monthIndex, day);

  const checkDate = new Date(utcTimestamp);
  if (
    checkDate.getUTCFullYear() !== year ||
    checkDate.getUTCMonth() !== monthIndex ||
    checkDate.getUTCDate() !== day
  ) {
    return null;
  }

  return utcTimestamp;
}

export function dateRangeValidator(
  fromControlName = 'from',
  toControlName = 'to',
  maxDays = 92,
): ValidatorFn {
  return (groupControl: AbstractControl): ValidationErrors | null => {
    const fromValue = groupControl.get(fromControlName)?.value;
    const toValue = groupControl.get(toControlName)?.value;

    if (typeof fromValue !== 'string' || typeof toValue !== 'string') {
      return null;
    }
    if (fromValue.trim().length === 0 || toValue.trim().length === 0) {
      return null;
    }

    const fromTimestamp = parseUtcMidnight(fromValue);
    const toTimestamp = parseUtcMidnight(toValue);
    if (fromTimestamp === null || toTimestamp === null) {
      return { dateRangeInvalidFormat: true };
    }

    if (fromTimestamp > toTimestamp) {
      return { dateRangeOrder: true };
    }

    const dayDifference = Math.round((toTimestamp - fromTimestamp) / MILLISECONDS_PER_DAY);
    if (dayDifference > maxDays) {
      return {
        dateRangeMaxDays: {
          maxDays,
          actualDays: dayDifference,
        },
      };
    }

    return null;
  };
}
