export interface User {
  id: number;
  lastname: string;
  firstname: string;
  email: string;
  role: 'user' | 'admin';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  lastname: string;
  firstname: string;
  email: string;
  password: string;
  confirmPassword: string;
}
