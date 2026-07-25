import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, KeyRound, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const verifyOtpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  otp: z.string().min(4, 'OTP must be at least 4 digits'),
});

type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;

export const VerifyOtp: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { useVerifyOtpMutation } = useAuth();
  const verifyOtpMutation = useVerifyOtpMutation();

  const defaultEmail = location.state?.email || '';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpFormData>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      email: defaultEmail,
      otp: '',
    },
  });

  const onSubmit = (data: VerifyOtpFormData) => {
    verifyOtpMutation.mutate(data, {
      onSuccess: () => {
        navigate('/login');
      },
    });
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="glass-card rounded-3xl p-8 space-y-6 border border-slate-200/60 dark:border-slate-800 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-glow font-bold text-xl">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Verify Account OTP</h1>
          <p className="text-xs text-slate-500">Enter the verification code sent to your email</p>
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
            label="Verification Code (OTP)"
            placeholder="e.g. 123456"
            leftIcon={<KeyRound className="w-4 h-4" />}
            {...register('otp')}
            error={errors.otp?.message}
          />

          <Button
            type="submit"
            className="w-full py-3 shadow-lg"
            isLoading={verifyOtpMutation.isPending}
            leftIcon={<CheckCircle className="w-4 h-4" />}
          >
            Verify & Continue
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-800">
          Already verified?{' '}
          <Link to="/login" className="font-bold text-primary-600 dark:text-primary-400 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
