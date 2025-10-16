'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mail } from 'lucide-react';
import { authService } from '@/lib/api/auth.service';

interface EmailVerificationProps {
  email: string;
  onBack?: () => void;
}

export function EmailVerification({ email, onBack }: EmailVerificationProps) {
  const router = useRouter();
  const [digits, setDigits] = useState(['', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [resendMessage, setResendMessage] = useState('');

  const handleDigitChange = (index: number, value: string) => {
    // Only allow single digit
    const digit = value.replace(/\D/g, '').slice(0, 1);

    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);

    // Auto-focus next input
    if (digit && index < 3) {
      const nextInput = document.getElementById(`digit-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      const prevInput = document.getElementById(`digit-${index - 1}`);
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
    document.getElementById(`digit-${focusIndex}`)?.focus();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const code = digits.join('');
    if (code.length !== 4) {
      setError('Please enter a 4-digit code');
      return;
    }

    setIsVerifying(true);

    try {
      await authService.verifyEmail({ email, code });
      // Redirect to dashboard on success
      router.push('/user');
    } catch (error) {
      console.error('Verification error:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Verification failed. Please check your code and try again.'
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setResendMessage('');
    setIsResending(true);

    try {
      await authService.resendVerificationCode({ email });
      setResendMessage('A new code has been sent to your email');
      setDigits(['', '', '', '']); // Clear the inputs
      document.getElementById('digit-0')?.focus();
    } catch (error) {
      console.error('Resend error:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to resend code. Please try again.'
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="border border-gray-200 shadow-none w-full">
      <CardHeader className="text-center pb-4 pt-6 sm:pb-6 sm:pt-8">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-norwegian-blue/10">
          <Mail className="h-6 w-6 text-norwegian-blue" />
        </div>
        <CardTitle className="text-2xl sm:text-3xl font-bold">
          Verify your email
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          We sent a 4-digit code to <strong>{email}</strong>
        </p>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <form onSubmit={handleVerify} className="space-y-5">
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Verification Code</Label>
            <div className="flex gap-3">
              {digits.map((digit, index) => (
                <Input
                  key={index}
                  id={`digit-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  disabled={isVerifying || isResending}
                  className={`w-14 h-14 text-center text-2xl font-semibold ${error ? 'border-red-500' : 'border-gray-300'}`}
                  autoFocus={index === 0}
                />
              ))}
            </div>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            {resendMessage && (
              <p className="text-sm text-green-600">{resendMessage}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-norwegian-blue hover:bg-norwegian-blue/90 text-white py-6 rounded-lg text-base font-medium"
            disabled={isVerifying || isResending || digits.join('').length !== 4}
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify Email'
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
            disabled={isVerifying || isResending}
          >
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Resend Code'
            )}
          </Button>
        </div>

        {onBack && (
          <div className="mt-4">
            <Button
              variant="ghost"
              className="w-full"
              onClick={onBack}
              disabled={isVerifying || isResending}
            >
              Back to Sign Up
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
