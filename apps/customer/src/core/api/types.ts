export type ApiError = {
  statusCode?: number;
  errorCode?: string;
  message: string;
  path?: string;
  timestamp?: string;
};

export type ApiResult<T> = {
  success: boolean;
  data: T;
};
