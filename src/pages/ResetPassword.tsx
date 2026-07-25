import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, KeyRound, Lock, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const resetPasswordSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    otp: z.string().min(4, 'OTP code is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const ResetPassword: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { useResetPasswordMutation } = useAuth();
  const resetPasswordMutation = useResetPasswordMutation();

  const defaultEmail = location.state?.email || '';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: defaultEmail,
      otp: '',
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPasswordMutation.mutate(data, {
      onSuccess: () => {
        navigate('/login');
      },
    });
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="glass-card rounded-3xl p-8 space-y-6 border border-slate-200/60 dark:border-slate-800 shadow-2xl">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Reset Password</h1>
          <p className="text-xs text-slate-500">Set a new password using the OTP received via email</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            leftIcon={<Mail className="w-4 h-4" />}
            {...register('email')}
            error={errors.email?.message}
          />

          <Input
            label="OTP Reset Code"
            placeholder="e.g. 123456"
            leftIcon={<KeyRound className="w-4 h-4" />}
            {...register('otp')}
            error={errors.otp?.message}
          />

          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            {...register('password')}
            error={errors.password?.message}
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />

          <Button
            type="submit"
            className="w-full py-3 shadow-lg"
            isLoading={resetPasswordMutation.isPending}
            leftIcon={<CheckCircle className="w-4 h-4" />}
          >
            Reset Password
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-800">
          <Link to="/login" className="font-bold text-primary-600 dark:text-primary-400 hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
