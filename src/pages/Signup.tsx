import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { User as UserIcon, Mail, Lock, Phone, UserPlus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const signupSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must be at most 20 characters'),
    email: z.string().trim().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[a-z]/, 'Password must include at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
      .regex(/\d/, 'Password must include at least one number'),
    confirmPassword: z.string(),
    phone: z.string().trim().min(10, 'Phone number must be at least 10 characters'),
    age: z.coerce.number().int().min(13, 'You must be at least 13 years old').max(100, 'Age must be 100 or below'),
    gender: z.enum(['male', 'female']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { useSignupMutation } = useAuth();
  const signupMutation = useSignupMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupFormData>();

  const validateForm = (data: SignupFormData) => {
    const result = signupSchema.safeParse(data);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (typeof field === 'string') {
          setError(field as keyof SignupFormData, {
            type: 'manual',
            message: issue.message,
          });
        }
      });
      return false;
    }

    return true;
  };

  const onSubmit = (data: SignupFormData) => {
    if (!validateForm(data)) {
      return;
    }
    signupMutation.mutate(
      {
        ...data,
        role: 'user',
      },
      {
        onSuccess: () => {
          navigate('/verify-otp', { state: { email: data.email } });
        },
      }
    );
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="glass-card rounded-3xl p-8 space-y-6 border border-slate-200/60 dark:border-slate-800 shadow-2xl">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Create Account</h1>
          <p className="text-xs text-slate-500">Join LuxeMart for instant checkout and exclusive offers</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Username"
            placeholder="JohnDoe"
            leftIcon={<UserIcon className="w-4 h-4" />}
            {...register('username')}
            error={errors.username?.message}
          />

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

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />

          <Input
            label="Phone Number"
            placeholder="+201012345678"
            leftIcon={<Phone className="w-4 h-4" />}
            {...register('phone')}
            error={errors.phone?.message}
          />

          <Input
            label="Age"
            type="number"
            placeholder="25"
            min={13}
            max={100}
            {...register('age', { valueAsNumber: true })}
            error={errors.age?.message}
          />

          <div className="w-full flex flex-col gap-1.5">
            <label htmlFor="gender" className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Gender
            </label>
            <select
              id="gender"
              {...register('gender')}
              className="w-full px-4 py-2.5 rounded-xl border text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {errors.gender?.message ? (
              <span className="text-xs text-red-500 font-medium">{errors.gender.message}</span>
            ) : null}
          </div>

          <Button
            type="submit"
            className="w-full py-3 shadow-lg"
            isLoading={signupMutation.isPending}
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Create Account
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-800">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-primary-600 dark:text-primary-400 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
