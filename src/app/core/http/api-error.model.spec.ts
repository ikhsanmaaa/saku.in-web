import { ApiError, isApiError, parseFieldErrors } from './api-error.model';

describe('ApiError & parseFieldErrors', () => {
  it('should parse semicolon-separated field errors into a record', () => {
    const parsed = parseFieldErrors('username: must not be blank; amount: must be greater than 0');

    expect(parsed).toEqual({
      username: 'must not be blank',
      amount: 'must be greater than 0',
    });
  });

  it('should return undefined when string has no field:message pairs', () => {
    expect(parseFieldErrors('Bad credentials')).toBeUndefined();
    expect(parseFieldErrors('')).toBeUndefined();
  });

  it('should identify ApiError instances with isApiError', () => {
    const apiError = new ApiError({ status: 400, message: 'Invalid input' });

    expect(isApiError(apiError)).toBe(true);
    expect(isApiError(new Error('Generic'))).toBe(false);
    expect(isApiError(null)).toBe(false);
  });
});
