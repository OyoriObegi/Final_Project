export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  error?: ApiError;
}

export interface PaginatedResponse<T> extends Omit<ApiResponse<T[]>, 'data'> {
  data: T[];
  total: number;
  page: number;
  limit: number;
} 