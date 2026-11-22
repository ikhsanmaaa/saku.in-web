import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

export interface PasswordChecklist {
  readonly hasMinLength: boolean;
  readonly hasUppercase: boolean;
  readonly hasDigit: boolean;
  readonly isValid: boolean;
}

export function evaluatePasswordRules(password: string): PasswordChecklist {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);

  return {
    hasMinLength,
    hasUppercase,
    hasDigit,
    isValid: hasMinLength && hasUppercase && hasDigit,
  };
}

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    const rawValue = control.value;
    if (typeof rawValue !== 'string' || rawValue.length === 0) {
      return null;
    }

    const checklist = evaluatePasswordRules(rawValue);
    if (checklist.isValid && PASSWORD_PATTERN.test(rawValue)) {
      return null;
    }

    return {
      passwordPolicy: {
        hasMinLength: checklist.hasMinLength,
        hasUppercase: checklist.hasUppercase,
        hasDigit: checklist.hasDigit,
      },
    };
  };
}
