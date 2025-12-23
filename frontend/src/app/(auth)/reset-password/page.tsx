'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { newPasswordSchema, NewPasswordFormData } from '@/lib/validations';
import { ROUTES } from '@/constants/routes';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [oobCode, setOobCode] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPasswordFormData>({
    resolver: zodResolver(newPasswordSchema),
  });

  useEffect(() => {
    const code = searchParams.get('oobCode');
    if (!code) {
      toast.error('Invalid or expired reset link');
      window.location.href = ROUTES.FORGOT_PASSWORD;
    } else {
      setOobCode(code);
    }
  }, [searchParams]);

  const onSubmit = async (data: NewPasswordFormData) => {
    if (!oobCode) return;

    setIsLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, data.password);
      setIsSuccess(true);
      toast.success('Password reset successfully!');
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      if (error.code === 'auth/expired-action-code') {
        toast.error('Password reset link has expired. Please request a new one.');
      } else if (error.code === 'auth/invalid-action-code') {
        toast.error('Invalid or already used password reset link. Please request a new one.');
      } else if (error.code === 'auth/user-disabled') {
        toast.error('Account has been disabled. Please contact support.');
      } else if (error.code === 'auth/user-not-found') {
        toast.error('User not found. Please check your email.');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Password is too weak. Please choose a stronger password.');
      } else {
        toast.error('Failed to reset password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="border-success/20">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <h2 className="text-2xl font-semibold text-text-primary mb-2">
                Password Reset Successful
              </h2>
              <p className="text-text-secondary mb-6">
                Your password has been reset successfully. You can now login with your new password.
              </p>
              <Link href={ROUTES.LOGIN}>
                <Button className="w-full">
                  Proceed to Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href={ROUTES.HOME} className="inline-flex items-center space-x-2">
            <span className="text-3xl font-serif font-bold text-primary">Framel</span>
            <span className="text-3xl">🌸</span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Set New Password</CardTitle>
            <p className="text-sm text-text-secondary text-center">
              Enter your new password below
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                  <Input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-error mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                  <Input
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-error mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </Button>

              {/* Back to Login */}
              <Link href={ROUTES.LOGIN}>
                <Button variant="ghost" className="w-full">
                  Back to Login
                </Button>
              </Link>
            </form>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href={ROUTES.HOME} className="text-sm text-text-secondary hover:text-primary">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
