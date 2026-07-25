import { axiosClient } from '../core/api/axiosClient';
import {
  AuthResponse,
  LoginDto,
  ProfileResponse,
  ResetPasswordDto,
  SignupDto,
  User,
  VerifyOtpDto,
} from '../domain/auth.types';

export const authService = {
  async signup(data: SignupDto): Promise<{ message: string }> {
    const res = await axiosClient.post<{ message: string }>('/auth/signup', data);
    return res.data;
  },

  async login(data: LoginDto): Promise<AuthResponse> {
    const res = await axiosClient.post<AuthResponse>('/auth/login', data);
    return res.data;
  },

  async verifyOtp(data: VerifyOtpDto): Promise<{ message: string }> {
    const res = await axiosClient.post<{ message: string }>('/auth/verify-otp', data);
    return res.data;
  },

  // Authenticated endpoint — no body needed; user identified by Bearer token
  async forgotPassword(): Promise<{ message: string }> {
    const res = await axiosClient.post<{ message: string }>('/auth/forgot-password');
    return res.data;
  },

  async resetPassword(data: ResetPasswordDto): Promise<{ message: string }> {
    const res = await axiosClient.post<{ message: string }>('/auth/reset-password', data);
    return res.data;
  },

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const res = await axiosClient.post<{ accessToken: string }>(
      '/auth/refresh-token',
      {},
      { headers: { Authorization: `Bearer ${refreshToken}` } }
    );
    return res.data;
  },

  async getProfile(): Promise<User> {
    const res = await axiosClient.get<User | ProfileResponse>('/users/profile');
    // API returns the user object directly
    const data = res.data as any;
    return data.user || data;
  },

  async uploadAvatar(formData: FormData): Promise<{ message?: string; url?: string }> {
    const res = await axiosClient.post('/users/upload-file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};
