export interface WebResponse<TData> {
  data: TData | null;
  errors: string | null;
}

export function isWebResponse(value: unknown): value is WebResponse<unknown> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  return 'data' in value && 'errors' in value;
}
