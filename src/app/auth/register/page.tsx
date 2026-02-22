'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/lib/validations/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import toast from 'react-hot-toast';
import type { z } from 'zod';

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data: RegisterFormData) {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error ?? 'Registration failed');
        return;
      }

      toast.success('Account created! Please sign in.');
      router.push('/auth/login');
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-center mb-6">Create Account</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          {...register('name')}
          error={errors.name?.message}
          placeholder="John Doe"
        />
        <Input
          label="Email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
          placeholder="you@example.com"
        />
        <Input
          label="Password"
          type="password"
          {...register('password')}
          error={errors.password?.message}
          placeholder="Min 8 chars, 1 uppercase, 1 number"
        />
        <Input
          label="Confirm Password"
          type="password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
          placeholder="••••••••"
        />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? <Spinner size="sm" /> : 'Create Account'}
        </Button>
      </form>

      <p className="text-sm text-center text-muted-foreground mt-6">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-accent hover:underline font-medium">
          Sign In
        </Link>
      </p>
    </div>
  );
}
