export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: unknown;
}

export function ok<T>(
  data?: T,
  message = 'Success',
): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
  };
}

export function created<T>(
  data?: T,
  message = 'Created',
): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
  };
}

export function fail(
  message: string,
  error?: unknown,
): ApiResponse {
  return {
    success: false,
    message,
    error,
  };
}
