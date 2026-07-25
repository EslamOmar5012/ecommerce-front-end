import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/useAuthStore';
import {
  ForgotPasswordDto,
  LoginDto,
  ResetPasswordDto,
  SignupDto,
  VerifyOtpDto,
} from '../domain/auth.types';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setAuth, setUser, isAuthenticated } = useAuthStore();

  const useLoginMutation = () =>
    useMutation({
      mutationFn: (data: LoginDto) => authService.login(data),
      onSuccess: async (res) => {
        const token = res.accessToken || res.token;
        const refreshToken = res.refreshToken || res.refresh_token;
        if (token) {
          // Set temporary auth first so getProfile call will have the token attached
          setAuth({ _id: '', username: '', email: '', role: 'user' }, token, refreshToken);
          try {
            const userProfile = await authService.getProfile();
            setAuth(userProfile, token, refreshToken);
            toast.success(`Welcome back, ${userProfile.username}!`);
          } catch (err) {
            toast.success(res.message || 'Login successful!');
          }
        } else {
          toast.success(res.message || 'Login successful!');
        }
      },
      onError: (err: any) => {
        const payload = err.response?.data;
        const requiresVerification = payload?.requiresVerification || payload?.error === 'EmailNotVerified';

        if (requiresVerification) {
          const email = err.config?.data ? JSON.parse(err.config.data).email : '';
          navigate('/verify-otp', { state: { email } });
          toast.error(payload?.message || 'Please verify your email before logging in.');
          return;
        }

        const msg = payload?.message || 'Login failed. Check your credentials.';
        toast.error(msg);
      },
    });

  const useSignupMutation = () =>
    useMutation({
      mutationFn: (data: SignupDto) => authService.signup(data),
      onSuccess: (res) => {
        toast.success(res.message || 'Account created successfully! Please verify OTP.');
      },
      onError: (err: any) => {
        const msg = err.response?.data?.message || 'Registration failed.';
        toast.error(msg);
      },
    });

  const useVerifyOtpMutation = () =>
    useMutation({
      mutationFn: (data: VerifyOtpDto) => authService.verifyOtp(data),
      onSuccess: (res) => {
        toast.success(res.message || 'OTP verified successfully! You can now log in.');
      },
      onError: (err: any) => {
        const msg = err.response?.data?.message || 'Invalid or expired OTP.';
        toast.error(msg);
      },
    });

  const useForgotPasswordMutation = () =>
    useMutation({
      mutationFn: (_data: ForgotPasswordDto) => authService.forgotPassword(),
      onSuccess: (res) => {
        toast.success(res.message || 'Reset code sent to your email.');
      },
      onError: (err: any) => {
        const msg = err.response?.data?.message || 'Failed to request password reset.';
        toast.error(msg);
      },
    });

  const useResetPasswordMutation = () =>
    useMutation({
      mutationFn: (data: ResetPasswordDto) => authService.resetPassword(data),
      onSuccess: (res) => {
        toast.success(res.message || 'Password reset successful! You can now log in.');
      },
      onError: (err: any) => {
        const msg = err.response?.data?.message || 'Failed to reset password.';
        toast.error(msg);
      },
    });

  const useProfileQuery = () =>
    useQuery({
      queryKey: ['profile'],
      queryFn: async () => {
        const user = await authService.getProfile();
        if (user) {
          setUser(user);
        }
        return user;
      },
      enabled: isAuthenticated,
    });

  const useUploadAvatarMutation = () =>
    useMutation({
      mutationFn: (formData: FormData) => authService.uploadAvatar(formData),
      onSuccess: (res) => {
        toast.success(res.message || 'Avatar uploaded successfully!');
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      },
      onError: (err: any) => {
        const msg = err.response?.data?.message || 'Failed to upload avatar.';
        toast.error(msg);
      },
    });

  return {
    useLoginMutation,
    useSignupMutation,
    useVerifyOtpMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useProfileQuery,
    useUploadAvatarMutation,
  };
};
