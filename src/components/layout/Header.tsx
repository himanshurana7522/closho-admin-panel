import { Bell, Search, LogOut, Menu } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate, useLocation } from 'react-router-dom';

const ROUTE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/stores': 'Stores',
  '/products': 'Products',
  '/products/new': 'New Product',
  '/stock': 'Stock Management',
  '/orders': 'Orders',
  '/reels': 'Reels',
  '/coupons': 'Coupons',
  '/customers': 'Customers',
  '/settings': 'Settings',
};

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Derive page title from route
  const pageTitle = ROUTE_TITLES[location.pathname] || 
    (location.pathname.startsWith('/orders/') ? `Order ${location.pathname.split('/').pop()}` : 
     location.pathname.startsWith('/products/') ? 'Edit Product' : 'Page');

  return (
    <header className="h-14 border-b border-white/[0.04] bg-black/40 backdrop-blur-xl px-5 flex items-center justify-between sticky top-0 z-30">
      {/* Left: mobile menu + page title */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden text-white/40 hover:text-white/70 h-8 w-8">
          <Menu className="h-4 w-4" />
        </Button>
        <h1 className="text-sm font-semibold text-white/90 hidden sm:block">{pageTitle}</h1>
      </div>

      {/* Center: search */}
      <div className="hidden md:flex items-center max-w-md w-full mx-8">
        <div className="search-bar w-full">
          <Search className="h-3.5 w-3.5 text-white/20 shrink-0" />
          <input 
            type="search" 
            placeholder="Search anything..." 
            className="bg-transparent border-0 outline-none text-sm text-white/80 placeholder:text-white/20 w-full"
          />
          <kbd className="hidden lg:inline-flex h-5 items-center gap-0.5 rounded border border-white/[0.06] bg-white/[0.03] px-1.5 font-mono text-[10px] text-white/20">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="relative text-white/30 hover:text-white/60 h-8 w-8 rounded-lg hover:bg-white/[0.04]">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary"></span>
        </Button>
        
        <div className="w-px h-5 bg-white/[0.06] mx-1"></div>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors outline-none cursor-pointer">
              <div className="h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center text-primary text-[10px] font-bold">
                {user?.fullName?.substring(0, 2).toUpperCase() || 'AD'}
              </div>
              <span className="text-xs font-medium text-white/60 hidden sm:block">{user?.fullName?.split(' ')[0]}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52 bg-[#0A0A0A] border-white/[0.06]" align="end">
            <DropdownMenuLabel className="font-normal px-3 py-2">
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-medium text-white/90">{user?.fullName || 'Admin User'}</p>
                <p className="text-[11px] text-white/30">{user?.email || 'admin@closho.com'}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/[0.04]" />
            <DropdownMenuItem className="cursor-pointer text-white/60 hover:text-white/90 px-3 py-2 text-xs" onClick={() => navigate('/settings')}>
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/[0.04]" />
            <DropdownMenuItem className="cursor-pointer text-red-400/70 hover:text-red-400 focus:bg-red-500/10 focus:text-red-400 px-3 py-2 text-xs" onClick={handleLogout}>
              <LogOut className="mr-2 h-3.5 w-3.5" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
