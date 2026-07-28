import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { 
  LayoutDashboard, 
  Store, 
  Package, 
  Boxes, 
  ShoppingCart, 
  Video, 
  Ticket, 
  Users, 
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'STORE_ADMIN'] },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { name: 'Products', path: '/products', icon: Package, roles: ['SUPER_ADMIN', 'STORE_ADMIN'] },
      { name: 'Stock', path: '/stock', icon: Boxes, roles: ['SUPER_ADMIN', 'STORE_ADMIN'] },
    ],
  },
  {
    label: 'Sales',
    items: [
      { name: 'Orders', path: '/orders', icon: ShoppingCart, roles: ['SUPER_ADMIN', 'STORE_ADMIN'] },
      { name: 'Coupons', path: '/coupons', icon: Ticket, roles: ['SUPER_ADMIN', 'STORE_ADMIN'] },
    ],
  },
  {
    label: 'Engagement',
    items: [
      { name: 'Stores', path: '/stores', icon: Store, roles: ['SUPER_ADMIN', 'STORE_ADMIN'] },
      { name: 'Reels', path: '/reels', icon: Video, roles: ['SUPER_ADMIN', 'STORE_ADMIN'] },
      { name: 'Customers', path: '/customers', icon: Users, roles: ['SUPER_ADMIN', 'STORE_ADMIN'] },
    ],
  },
  {
    label: 'System',
    items: [
      { name: 'Settings', path: '/settings', icon: Settings, roles: ['SUPER_ADMIN'] },
    ],
  },
];

interface SidebarProps {
  isOpen?: boolean;
  setIsOpen?: (val: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden" 
          onClick={() => setIsOpen?.(false)}
        />
      )}
      <div className={cn(
        "w-[260px] bg-[#050505] min-h-screen flex flex-col border-r border-white/[0.04] fixed inset-y-0 left-0 z-50 md:sticky md:top-0 transition-transform duration-300 ease-in-out transform",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
      {/* Logo */}
      <div className="h-16 flex items-center px-5 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="bg-primary text-primary-foreground font-bold text-sm h-8 w-8 flex items-center justify-center rounded-lg">
            C
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-bold text-white tracking-wide">CLOSHO</span>
            <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase -mt-0.5">Admin Panel</span>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-5">
        {NAV_SECTIONS.map((section) => {
          const visibleItems = section.items.filter(
            (item) => user && item.roles.includes(user.role)
          );
          if (visibleItems.length === 0) return null;

          return (
            <div key={section.label}>
              <div className="text-[10px] font-semibold text-white/20 uppercase tracking-[0.15em] mb-1.5 px-3">
                {section.label}
              </div>
              <div className="space-y-0.5">
                {visibleItems.map((item) => {
                  const isActive =
                    location.pathname === item.path ||
                    (item.path !== '/' && location.pathname.startsWith(item.path));
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsOpen?.(false)}
                      className={cn(
                        'group flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 relative',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03]'
                      )}
                    >
                      <item.icon
                        className={cn(
                          'h-[18px] w-[18px] shrink-0 transition-colors duration-150',
                          isActive ? 'text-primary' : 'text-white/30 group-hover:text-white/50'
                        )}
                        strokeWidth={isActive ? 2 : 1.5}
                      />
                      <span>{item.name}</span>
                      {isActive && (
                        <ChevronRight className="h-3.5 w-3.5 ml-auto text-primary/50" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
      
      {/* User card */}
      <div className="p-3 mt-auto">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] group hover:bg-white/[0.04] transition-colors">
          <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-bold shrink-0">
            {user?.name?.substring(0, 2).toUpperCase() || 'AD'}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-medium text-white/80 truncate">{user?.name}</span>
            <span className="text-[10px] text-white/25 truncate">{user?.role?.replace('_', ' ')}</span>
          </div>
          <button
            onClick={logout}
            className="text-white/15 hover:text-red-400 transition-colors p-1 rounded-md hover:bg-white/[0.04]"
            title="Log out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      </div>
    </>
  );
}
