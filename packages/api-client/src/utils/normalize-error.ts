import axios from 'axios';

export interface NormalizedError {
  message: string;
  code?: string;
  status?: number;
  isNetworkError: boolean;
  isAuthError: boolean;
  originalError: any;
}

export const normalizeApiError = (error: any): NormalizedError => {
  const normalized: NormalizedError = {
    message: 'An unexpected error occurred',
    isNetworkError: false,
    isAuthError: false,
    originalError: error,
  };

  if (axios.isAxiosError(error)) {
    normalized.status = error.response?.status;
    normalized.code = error.response?.data?.error;
    normalized.message = error.response?.data?.message || error.message;
    normalized.isNetworkError = !error.response;
    normalized.isAuthError = error.response?.status === 401;
  } else if (error instanceof Error) {
    normalized.message = error.message;
  }

  return normalized;
};

export const isNetworkError = (error: any) => axios.isAxiosError(error) && !error.response;
export const isUnauthorized = (error: any) => axios.isAxiosError(error) && error.response?.status === 401;
