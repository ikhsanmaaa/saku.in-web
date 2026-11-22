import { FormControl, FormGroup } from '@angular/forms';
import { dateRangeValidator } from './date-range.validator';

describe('dateRangeValidator', () => {
  function createRangeGroup(fromDate: string, toDate: string): FormGroup {
    return new FormGroup(
      {
        from: new FormControl(fromDate, { nonNullable: true }),
        to: new FormControl(toDate, { nonNullable: true }),
      },
      { validators: [dateRangeValidator('from', 'to', 92)] },
    );
  }

  it('should accept range of exactly 92 days', () => {
    const group = createRangeGroup('2026-01-01', '2026-04-03');
    expect(group.valid).toBe(true);
    expect(group.errors).toBeNull();
  });

  it('should reject range exceeding 92 days (93 days)', () => {
    const group = createRangeGroup('2026-01-01', '2026-04-04');
    expect(group.invalid).toBe(true);
    expect(group.errors).toEqual({
      dateRangeMaxDays: { maxDays: 92, actualDays: 93 },
    });
  });

  it('should reject range when from date is after to date', () => {
    const group = createRangeGroup('2026-05-10', '2026-05-01');
    expect(group.invalid).toBe(true);
    expect(group.errors).toEqual({ dateRangeOrder: true });
  });
});
