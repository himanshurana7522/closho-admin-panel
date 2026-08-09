import { Bell, Search, LogOut, Menu, Loader2 } from 'lucide-react';
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

const ROUTE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/stores': 'Stores',
  '/products': 'Products',
  '/products/new': 'New Product',
  '/stock': 'Stock Management',
  '/orders': 'Orders',
  '/sales': 'Sales Report',
  '/reels': 'Reels',
  '/banners': 'Banners',
  '/categories': 'Categories',
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
  const queryClient = useQueryClient();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Derive page title from route
  const pageTitle = ROUTE_TITLES[location.pathname] || 
    (location.pathname.startsWith('/orders/') ? `Order ${location.pathname.split('/').pop()}` : 
     location.pathname.startsWith('/products/') ? 'Edit Product' : 'Page');

  // Notifications
  const { data: notifData, isLoading: isNotifLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      try {
        const res = await api.get('/notifications');
        return res.data.data || res.data;
      } catch (err) {
        return { notifications: [], unreadCount: 0 };
      }
    },
    refetchInterval: 30000 // Poll every 30 seconds
  });

  const notifications = notifData?.notifications || [];
  const unreadCount = notifData?.unreadCount || 0;

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.patch(`/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      return await api.post('/notifications/read-all');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('All notifications marked as read');
    }
  });

  const handleNotificationClick = (n: any) => {
    if (!n.isRead) {
      markAsReadMutation.mutate(n.id || n._id);
    }
    // Navigate if there's a link (like an order)
    if (n.type === 'ORDER_PLACED' || n.type === 'ORDER_STATUS_CHANGED') {
      if (n.data?.orderId) {
        navigate(`/orders/${n.data.orderId}`);
      }
    }
  };

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
        
        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="relative text-white/30 hover:text-white/60 h-8 w-8 rounded-lg hover:bg-white/[0.04] outline-none inline-flex items-center justify-center">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary border border-black animate-pulse"></span>
              )}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 bg-[#0A0A0A] border-white/[0.06] p-0" align="end">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04]">
              <span className="text-sm font-semibold text-white/90">Notifications</span>
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  className="h-auto p-0 text-[11px] text-primary hover:text-primary/80 hover:bg-transparent"
                  onClick={(e) => {
                    e.preventDefault();
                    markAllReadMutation.mutate();
                  }}
                  disabled={markAllReadMutation.isPending}
                >
                  Mark all as read
                </Button>
              )}
            </div>
            
            <div className="max-h-[300px] overflow-y-auto">
              {isNotifLoading ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-5 w-5 animate-spin text-white/20" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-8 text-center flex flex-col items-center justify-center">
                  <Bell className="h-8 w-8 text-white/10 mb-2" />
                  <p className="text-xs text-white/30">No notifications yet.</p>
                </div>
              ) : (
                notifications.map((n: any) => (
                  <div 
                    key={n.id || n._id} 
                    className={`px-4 py-3 border-b border-white/[0.02] last:border-0 hover:bg-white/[0.02] cursor-pointer transition-colors ${!n.isRead ? 'bg-primary/5' : ''}`}
                    onClick={() => handleNotificationClick(n)}
                  >
                    <div className="flex gap-3">
                      <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${!n.isRead ? 'bg-primary' : 'bg-transparent'}`} />
                      <div className="space-y-1">
                        <p className={`text-xs ${!n.isRead ? 'text-white/90 font-medium' : 'text-white/60'}`}>
                          {n.title || n.message}
                        </p>
                        {n.title && n.message && (
                          <p className="text-[11px] text-white/40 line-clamp-2">{n.message}</p>
                        )}
                        <p className="text-[10px] text-white/25">
                          {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
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
