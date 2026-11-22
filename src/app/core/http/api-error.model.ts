export interface ApiErrorOptions {
  readonly status: number;
  readonly message: string;
  readonly fieldErrors?: Record<string, string>;
  readonly code?: string;
  readonly retryAfterSeconds?: number;
}

export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors?: Record<string, string>;
  readonly code?: string;
  readonly retryAfterSeconds?: number;

  constructor(options: ApiErrorOptions) {
    super(options.message);
    this.name = 'ApiError';
    this.status = options.status;
    this.fieldErrors = options.fieldErrors;
    this.code = options.code;
    this.retryAfterSeconds = options.retryAfterSeconds;
  }
}

export function isApiError(value: unknown): value is ApiError {
  return value instanceof ApiError;
}

/**
 * Parses backend validation strings formatted as "field: message; field2: message2".
 */
export function parseFieldErrors(rawErrors: string): Record<string, string> | undefined {
  const segments = rawErrors
    .split(';')
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0);

  const parsedEntries: Record<string, string> = {};
  let hasAnyFieldError = false;

  for (const segment of segments) {
    const separatorIndex = segment.indexOf(':');
    if (separatorIndex <= 0) {
      continue;
    }

    const fieldName = segment.slice(0, separatorIndex).trim();
    const fieldMessage = segment.slice(separatorIndex + 1).trim();
    if (fieldName.length > 0 && fieldMessage.length > 0) {
      parsedEntries[fieldName] = fieldMessage;
      hasAnyFieldError = true;
    }
  }

  return hasAnyFieldError ? parsedEntries : undefined;
}
