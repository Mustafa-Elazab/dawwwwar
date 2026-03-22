// Standard single-item response
export interface ApiResponse<T> {
  success: true;
  data: T;
}

// Standard paginated response
export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Standard error response
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    statusCode: number;
  };
}

// Either success or error
export type ApiResult<T> = ApiResponse<T> | ApiError;

// Helper type guards
export function isApiError(res: unknown): res is ApiError {
  return (
    typeof res === 'object' &&
    res !== null &&
    'success' in res &&
    (res as ApiError).success === false
  );
}

// Auth-specific response types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: import('./models').User;
  isFirstLogin: boolean;
}

// Pagination request params
export interface PaginationParams {
  page?: number;
  limit?: number;
}

// Location params used by nearby searches
export interface LocationParams {
  latitude: number;
  longitude: number;
  radius?: number;  // km
}
