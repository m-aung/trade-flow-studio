export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  error?: any;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  email: string;
  role: string;
  first_name?: string;
  last_name?: string;
  status: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
} 