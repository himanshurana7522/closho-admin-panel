import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { LoginForm } from '@/features/auth/LoginForm';

export function Login() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen w-full flex bg-black">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-12 bg-[#030303] border-r border-white/[0.04] overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-primary/[0.04] rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-primary/[0.02] rounded-full blur-[128px] pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="bg-primary text-primary-foreground font-bold text-sm h-8 w-8 flex items-center justify-center rounded-lg">
            C
          </div>
          <span className="text-[15px] font-bold text-white tracking-wide">CLOSHO</span>
        </div>

        <div className="relative z-10 space-y-5 max-w-md">
          <h1 className="text-4xl font-semibold tracking-tight text-white leading-[1.15]">
            Manage your stores
            <br />
            with <span className="text-primary">precision.</span>
          </h1>
          <p className="text-sm text-white/30 leading-relaxed max-w-sm">
            The premium admin dashboard for Closho fashion partners. Track orders, manage inventory, and grow your revenue in real-time.
          </p>
          <div className="pt-4 flex items-center gap-6 text-xs text-white/20">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full" />
              System Operational
            </div>
            <div>12,450+ Active Products</div>
          </div>
        </div>

        <div className="relative z-10 text-[10px] text-white/10">
          © 2026 Closho. All rights reserved.
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative">
        <div className="w-full max-w-[380px] space-y-8">
          {/* Mobile logo */}
          <div className="flex flex-col space-y-2 text-center lg:text-left">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
              <div className="bg-primary text-primary-foreground font-bold h-8 w-8 flex items-center justify-center rounded-lg text-sm">
                C
              </div>
              <span className="text-[15px] font-bold tracking-wide">CLOSHO</span>
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-white">Welcome back</h2>
            <p className="text-sm text-white/30">
              Sign in to your admin account to continue.
            </p>
          </div>
          
          <div className="bg-[#0A0A0A] border border-white/[0.04] p-6 rounded-xl">
            <LoginForm />
          </div>
          
          <p className="text-center text-[10px] text-white/15">
            Protected by Closho Security. By continuing, you agree to our{' '}
            <a href="#" className="underline hover:text-primary transition-colors">Terms of Service</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
