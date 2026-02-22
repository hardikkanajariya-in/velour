'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema } from '@/lib/validations/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import toast from 'react-hot-toast';
import type { z } from 'zod';

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>({ resolver: zodResolver(forgotPasswordSchema) });

  async function onSubmit(data: ForgotPasswordData) {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSent(true);
      } else {
        toast.error('Failed to send reset email');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">✉️</span>
        </div>
        <h1 className="text-2xl font-heading font-bold mb-2">Check Your Email</h1>
        <p className="text-sm text-muted-foreground mb-6">
          We&apos;ve sent a password reset link to your email address. Please check your inbox.
        </p>
        <Link href="/auth/login" className="text-sm text-accent hover:underline">
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-center mb-2">Forgot Password</h1>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
          placeholder="you@example.com"
        />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? <Spinner size="sm" /> : 'Send Reset Link'}
        </Button>
      </form>

      <p className="text-sm text-center text-muted-foreground mt-6">
        Remember your password?{' '}
        <Link href="/auth/login" className="text-accent hover:underline font-medium">
          Sign In
        </Link>
      </p>
    </div>
  );
}
