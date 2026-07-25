export type UserRole = 'user' | 'admin';
export type UserGender = 'male' | 'female';
export type UserProvider = 'system' | 'google';

export interface User {
  _id: string;
  id?: string;
  username: string;
  email: string;
  phone?: string;
  age?: number;
  gender?: UserGender;
  role: UserRole;
  profilePic?: string;
  coverPics?: string[];
  files?: string[];
  isEmailConfirmed?: boolean;
  provider?: UserProvider;
  wishlist?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SignupDto {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  age: number;
  gender: UserGender;
  role?: UserRole;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface VerifyOtpDto {
  email: string;
  otp: string;
}

export interface ForgotPasswordDto {
  email?: string;
}

export interface ResetPasswordDto {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  // legacy fallbacks
  token?: string;
  refresh_token?: string;
  user?: User;
}

export interface ProfileResponse {
  user?: User;
}
