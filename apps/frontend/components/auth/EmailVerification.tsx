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
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [resendMessage, setResendMessage] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!code || code.length !== 4) {
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
      setCode(''); // Clear the input
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
    <Card className="border-0 shadow-xl">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          <div className="bg-norwegian-blue/10 p-3 rounded-full">
            <Mail className="h-6 w-6 text-norwegian-blue" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center">
          Verify your email
        </CardTitle>
        <CardDescription className="text-center">
          We sent a 4-digit code to <strong>{email}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              placeholder="Enter 4-digit code"
              value={code}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setCode(value);
              }}
              disabled={isVerifying || isResending}
              className={`text-center text-2xl tracking-widest ${error ? 'border-red-500' : ''}`}
              autoFocus
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            {resendMessage && (
              <p className="text-sm text-green-600">{resendMessage}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-norwegian-blue hover:bg-norwegian-blue/90"
            disabled={isVerifying || isResending || code.length !== 4}
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
          <p className="text-sm text-center text-muted-foreground">
            Did not receive the code?
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
