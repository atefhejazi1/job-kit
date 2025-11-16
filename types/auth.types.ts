
export interface User {
  id: string;
  name: string | null;
  email: string;
  userType: 'USER' | 'COMPANY';
  avatarUrl?: string | null;
  createdAt: Date;
  updatedAt?: Date;
}

export interface UserWithPassword extends User {
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  userType: 'USER' | 'COMPANY';
}

export interface AuthResponse {
  message: string;
  user: User;
}

export interface ErrorResponse {
  error: string;
}

// Form types for Formik
export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}