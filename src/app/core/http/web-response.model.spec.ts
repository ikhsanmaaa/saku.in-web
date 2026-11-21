import { isWebResponse } from './web-response.model';

describe('isWebResponse', () => {
  it('should return true when value has data and errors properties', () => {
    const validResponse = { data: { balance: 1000 }, errors: null };

    const result = isWebResponse(validResponse);

    expect(result).toBe(true);
  });

  it('should return true when data is null and errors is a string', () => {
    const errorResponse = { data: null, errors: 'Validation failed' };

    const result = isWebResponse(errorResponse);

    expect(result).toBe(true);
  });

  it('should return false when value is null or primitive', () => {
    expect(isWebResponse(null)).toBe(false);
    expect(isWebResponse(undefined)).toBe(false);
    expect(isWebResponse('unauthorized')).toBe(false);
    expect(isWebResponse(401)).toBe(false);
  });

  it('should return false when object lacks data or errors properties', () => {
    expect(isWebResponse({ message: 'Unauthorized' })).toBe(false);
    expect(isWebResponse({ data: null })).toBe(false);
    expect(isWebResponse({ errors: 'Bad request' })).toBe(false);
  });
});
