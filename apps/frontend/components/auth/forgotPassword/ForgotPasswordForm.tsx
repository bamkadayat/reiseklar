'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, CheckCircle2, Eye, EyeOff, Mail } from 'lucide-react';
import { authService } from '@/lib/api/auth.service';
import * as z from 'zod';

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [digits, setDigits] = useState(['', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendMessage, setResendMessage] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const handleDigitChange = (index: number, value: string) => {
    // Only allow single digit
    const digit = value.replace(/\D/g, '').slice(0, 1);

    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);

    // Auto-focus next input
    if (digit && index < 3) {
      const nextInput = document.getElementById(`reset-digit-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      const prevInput = document.getElementById(`reset-digit-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    const newDigits = pastedData.split('').concat(['', '', '', '']).slice(0, 4);
    setDigits(newDigits);

    // Focus the next empty input or the last one
    const nextEmptyIndex = newDigits.findIndex(d => !d);
    const focusIndex = nextEmptyIndex === -1 ? 3 : nextEmptyIndex;
    document.getElementById(`reset-digit-${focusIndex}`)?.focus();
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      await authService.forgotPassword({ email });
      setStep('reset');
    } catch (error) {
      console.error('Forgot password error:', error);
      setError(error instanceof Error ? error.message : 'Failed to send reset code');
    } finally {
      setIsLoading(false);
    }
  };

  const validatePassword = () => {
    const errors: string[] = [];
    const validation = resetPasswordSchema.safeParse({ password, confirmPassword });

    if (!validation.success) {
      validation.error.errors.forEach(err => {
        if (err.path[0] === 'password' || err.path[0] === 'confirmPassword') {
          errors.push(err.message);
        }
      });
    }

    setPasswordErrors(errors);
    return errors.length === 0;
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPasswordErrors([]);

    const code = digits.join('');
    if (code.length !== 4) {
      setError('Please enter a 4-digit code');
      return;
    }

    if (!validatePassword()) {
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword({ email, code, password });
      // Redirect to sign in after successful reset
      router.push('/signIn?reset=success');
    } catch (error) {
      console.error('Reset password error:', error);
      setError(error instanceof Error ? error.message : 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setResendMessage('');
    setIsLoading(true);

    try {
      await authService.forgotPassword({ email });
      setResendMessage('A new code has been sent to your email');
      setDigits(['', '', '', '']);
      document.getElementById('reset-digit-0')?.focus();
    } catch (error) {
      console.error('Resend error:', error);
      setError(error instanceof Error ? error.message : 'Failed to resend code');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Enter email
  if (step === 'email') {
    return (
      <Card className="border border-gray-200 shadow-none w-full">
        <CardHeader className="text-center pb-4 pt-6 sm:pb-6 sm:pt-8">
          <CardTitle className="text-2xl sm:text-3xl font-bold">Forgot password?</CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Enter your email address and we&apos;ll send you a 4-digit code to reset your password.
          </p>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleEmailSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className={`h-12 ${error ? 'border-red-500' : ''}`}
                autoFocus
              />
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-norwegian-blue hover:bg-norwegian-blue/90 text-white py-6 rounded-lg text-base font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending code...
                </>
              ) : (
                'Send reset code'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="pb-8 flex justify-center">
          <Link
            href="/signIn"
            className="inline-flex items-center text-sm text-blue-600 hover:underline font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to sign in
          </Link>
        </CardFooter>
      </Card>
    );
  }

  // Step 2: Enter code and new password
  return (
    <Card className="border border-gray-200 shadow-none w-full">
      <CardHeader className="text-center pb-4 pt-6 sm:pb-6 sm:pt-8">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-norwegian-blue/10">
          <Mail className="h-6 w-6 text-norwegian-blue" />
        </div>
        <CardTitle className="text-2xl sm:text-3xl font-bold">Reset your password</CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          We sent a 4-digit code to <strong>{email}</strong>
        </p>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <form onSubmit={handleResetSubmit} className="space-y-5">
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Verification Code</Label>
            <div className="flex gap-3">
              {digits.map((digit, index) => (
                <Input
                  key={index}
                  id={`reset-digit-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  disabled={isLoading}
                  className={`w-14 h-14 text-center text-2xl font-semibold ${error && !passwordErrors.length ? 'border-red-500' : 'border-gray-300'}`}
                  autoFocus={index === 0}
                />
              ))}
            </div>
            {resendMessage && (
              <p className="text-sm text-green-600">{resendMessage}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="h-12 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Must be at least 8 characters with uppercase, lowercase, and number
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className="h-12 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {(error || passwordErrors.length > 0) && (
            <div className="space-y-1">
              {error && <p className="text-sm text-red-500">{error}</p>}
              {passwordErrors.map((err, idx) => (
                <p key={idx} className="text-sm text-red-500">{err}</p>
              ))}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-norwegian-blue hover:bg-norwegian-blue/90 text-white py-6 rounded-lg text-base font-medium"
            disabled={isLoading || digits.join('').length !== 4}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting password...
              </>
            ) : (
              'Reset password'
            )}
          </Button>
        </form>

        <div className="mt-4 space-y-2">
          <p className="text-sm text-center text-gray-600">
            Didn&apos;t receive the code?
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleResend}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Resend Code'
            )}
          </Button>
        </div>

        <div className="mt-4">
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => setStep('email')}
            disabled={isLoading}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
