import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/admin/auth/login', {
        email: data.email,
        password: data.password,
        rememberMe: true,
      });
      
      if (response.data.success) {
        const { accessToken, user } = response.data.data;
        // Make sure user role maps correctly or is returned by the API
        login({
          id: user.id,
          fullName: user.fullName || user.name || 'Admin',
          email: user.email,
          phone: user.phone,
          role: user.role || 'SUPER_ADMIN',
          storeId: user.storeId
        }, accessToken);
        navigate('/');
      } else {
        setError(response.data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="px-3 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg">
          {error}
        </div>
      )}
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-xs font-medium text-white/40">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="admin@closho.com"
          {...register('email')}
          className={`bg-white/[0.03] border-white/[0.06] h-9 text-sm placeholder:text-white/15 focus-visible:ring-primary/30 focus-visible:border-primary/40 ${errors.email ? 'border-red-500/40' : ''}`}
        />
        {errors.email && (
          <p className="text-[11px] text-red-400/80">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-xs font-medium text-white/40">Password</Label>
          <a href="#" className="text-[11px] text-primary/70 hover:text-primary font-medium transition-colors">
            Forgot password?
          </a>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          className={`bg-white/[0.03] border-white/[0.06] h-9 text-sm placeholder:text-white/15 focus-visible:ring-primary/30 focus-visible:border-primary/40 ${errors.password ? 'border-red-500/40' : ''}`}
        />
        {errors.password && (
          <p className="text-[11px] text-red-400/80">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full mt-2 h-9 text-xs font-medium" disabled={isLoading}>
        {isLoading ? (
          <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> Signing in...</>
        ) : (
          'Sign In'
        )}
      </Button>
    </form>
  );
}
