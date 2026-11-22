import { FormControl } from '@angular/forms';
import { evaluatePasswordRules, passwordValidator } from './password.validator';

describe('passwordValidator', () => {
  it('should accept password meeting length, uppercase, and digit rules', () => {
    const control = new FormControl('Password123', {
      nonNullable: true,
      validators: [passwordValidator()],
    });

    expect(control.valid).toBe(true);
    expect(control.errors).toBeNull();
  });

  it('should reject password shorter than 8 characters', () => {
    const control = new FormControl('Pass123', {
      nonNullable: true,
      validators: [passwordValidator()],
    });

    expect(control.invalid).toBe(true);
    expect(control.errors?.['passwordPolicy']).toEqual({
      hasMinLength: false,
      hasUppercase: true,
      hasDigit: true,
    });
  });

  it('should reject password without uppercase letter', () => {
    const control = new FormControl('password123', {
      nonNullable: true,
      validators: [passwordValidator()],
    });

    expect(control.invalid).toBe(true);
    expect(control.errors?.['passwordPolicy']).toEqual({
      hasMinLength: true,
      hasUppercase: false,
      hasDigit: true,
    });
  });

  it('should reject password without digit', () => {
    const control = new FormControl('PasswordOnly', {
      nonNullable: true,
      validators: [passwordValidator()],
    });

    expect(control.invalid).toBe(true);
    expect(control.errors?.['passwordPolicy']).toEqual({
      hasMinLength: true,
      hasUppercase: true,
      hasDigit: false,
    });
  });

  it('should evaluate live checklist rules accurately', () => {
    expect(evaluatePasswordRules('abc')).toEqual({
      hasMinLength: false,
      hasUppercase: false,
      hasDigit: false,
      isValid: false,
    });
    expect(evaluatePasswordRules('Abcdefg1')).toEqual({
      hasMinLength: true,
      hasUppercase: true,
      hasDigit: true,
      isValid: true,
    });
  });
});
