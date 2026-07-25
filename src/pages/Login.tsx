import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { useLoginMutation } = useAuth();
  const loginMutation = useLoginMutation();

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        navigate(from, { replace: true });
      },
    });
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="glass-card rounded-3xl p-8 space-y-6 border border-slate-200/60 dark:border-slate-800 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center mx-auto shadow-glow font-bold text-xl">
            L
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Welcome Back</h1>
          <p className="text-xs text-slate-500">Sign in to access your cart, wishlist, and orders</p>
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
            label="Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            {...register('password')}
            error={errors.password?.message}
          />

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full py-3 shadow-lg"
            isLoading={loginMutation.isPending}
            leftIcon={<LogIn className="w-4 h-4" />}
          >
            Sign In
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-800">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-primary-600 dark:text-primary-400 hover:underline">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};
