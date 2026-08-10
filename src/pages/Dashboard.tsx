import { useState } from 'react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  AlertCircle, 
  Store,
  Calendar as CalendarIcon,
  ChevronDown,
  Loader2,
  Film
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export function Dashboard() {
  const [selectedStore, setSelectedStore] = useState('all');

  const { data: stores = [] } = useQuery({
    queryKey: ['admin-stores-list'],
    queryFn: async () => {
      const res = await api.get('/admin/stores');
      if (res?.data?.data && Array.isArray(res.data.data)) return res.data.data;
      if (res?.data?.stores && Array.isArray(res.data.stores)) return res.data.stores;
      if (res?.data && Array.isArray(res.data)) return res.data;
      return [];
    }
  });

  const { data: dashRes, isLoading: isDashLoading } = useQuery({
    queryKey: ['admin-dashboard', selectedStore],
    queryFn: async () => {
      const params = selectedStore !== 'all' ? { storeId: selectedStore } : {};
      const res = await api.get('/admin/dashboard', { params });
      return res.data.data || res.data;
    }
  });

  const { data: ordersRes, isLoading: isOrdersLoading } = useQuery({
    queryKey: ['admin-dashboard-orders', selectedStore],
    queryFn: async () => {
      const params: any = { limit: 5 };
      if (selectedStore !== 'all') params.storeId = selectedStore;
      const res = await api.get('/admin/orders', { params });
      if (res?.data?.data && Array.isArray(res.data.data)) return res.data.data;
      if (res?.data?.orders && Array.isArray(res.data.orders)) return res.data.orders;
      if (res?.data && Array.isArray(res.data)) return res.data;
      return [];
    }
  });

  const dash = dashRes || {
    totalRevenue: 0,
    totalOrders: 0,
    activeStores: 0,
    totalProducts: 0,
    lowStockCount: 0,
    salesChart: []
  };

  const recentOrders = ordersRes || [];

  if (isDashLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-1">Welcome back. Here is what's happening with your stores today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedStore} onValueChange={(val) => val && setSelectedStore(val)}>
            <SelectTrigger className="w-[180px] h-9 bg-white/[0.03] border-white/[0.06] text-xs">
              <SelectValue placeholder="All Stores" />
            </SelectTrigger>
            <SelectContent className="bg-[#0A0A0A] border-white/[0.06]">
              <SelectItem value="all">All Stores</SelectItem>
              {stores.map((store: any) => (
                <SelectItem key={store.id || store._id} value={store.id || store._id}>
                  {store.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2 bg-white/[0.03] border-white/[0.06] text-white/60 hover:bg-white/[0.06] hover:text-white/80 transition-all duration-200 rounded-lg h-9">
            <CalendarIcon className="h-4 w-4" />
            <span>Last 7 Days</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button onClick={() => toast.success('Report download started')} className="bg-[#F5C518] text-black hover:bg-[#F5C518]/90 font-medium rounded-lg transition-all duration-200">
            Download Report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card className="bg-[#0A0A0A] border border-white/[0.04] border-l-2 border-l-[#F5C518] rounded-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-white/50">Total Revenue</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-[#F5C518]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">₹{dash.totalRevenue?.toLocaleString() || 0}</div>
            <p className="text-xs text-white/40 mt-1">
              Total gross revenue
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0A0A0A] border border-white/[0.04] border-l-2 border-l-blue-500 rounded-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-white/50">Orders</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
              <ShoppingCart className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{dash.totalOrders || 0}</div>
            <p className="text-xs text-white/40 mt-1">
              Total orders placed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#0A0A0A] border border-white/[0.04] border-l-2 border-l-purple-500 rounded-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-white/50">Active Stores</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
              <Store className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{dash.activeStores || 0}</div>
            <p className="text-xs text-white/40 mt-1">
              Currently operational
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#0A0A0A] border border-white/[0.04] border-l-2 border-l-emerald-500 rounded-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-white/50">Total Products</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
              <Package className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{dash.totalProducts || 0}</div>
            <p className="text-xs text-white/40 mt-1">
              In your catalog
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#0A0A0A] border border-white/[0.04] border-l-2 border-l-red-500 rounded-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-white/50">Low Stock</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{dash.lowStockCount || 0}</div>
            <p className="text-xs text-red-400 mt-1">
              Items need restocking
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#0A0A0A] border border-white/[0.04] border-l-2 border-l-pink-500 rounded-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-white/50">Active Reels</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
              <Film className="h-4 w-4 text-pink-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{dash.reelsStats?.activeReels || dash.reelsStats?.totalReels || 0}</div>
            <p className="text-xs text-white/40 mt-1">
              Shoppable videos
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-[#0A0A0A] border border-white/[0.04] rounded-xl">
          <CardHeader>
            <CardTitle className="text-white">Revenue Overview</CardTitle>
            <CardDescription className="text-white/50">Daily revenue performance for the selected period.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dash.salesChart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F5C518" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#F5C518" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#a1a1aa" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    dy={10} 
                  />
                  <YAxis 
                    stroke="#a1a1aa" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `₹${value}`}
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0A0A0A', borderColor: 'rgba(255,255,255,0.04)', borderRadius: '12px', boxShadow: '0 4px 20px -2px rgb(0 0 0 / 0.5)' }} 
                    itemStyle={{ color: '#F5C518', fontWeight: 600 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#F5C518" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#F5C518' }} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 flex flex-col bg-[#0A0A0A] border border-white/[0.04] rounded-xl">
          <CardHeader>
            <CardTitle className="text-white">Recent Orders</CardTitle>
            <CardDescription className="text-white/50">Latest transactions across all stores.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <div className="space-y-2">
              {isOrdersLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin text-white/20" />
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="text-center py-10 text-white/40 text-sm">No recent orders</div>
              ) : recentOrders.map((order: any, i: number) => {
                const storeName = order.store?.name || 'Unknown Store';
                const itemsCount = order.items?.length || 0;
                
                return (
                  <div key={order.id || order._id || i} className="flex items-center justify-between group p-3 hover:bg-white/[0.02] rounded-xl transition-all duration-200 border border-transparent hover:border-white/[0.04]">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center transition-colors group-hover:bg-white/[0.06]">
                        <ShoppingCart className="h-4 w-4 text-white/60 group-hover:text-white/90" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold leading-none text-white">Order #{order.id || order._id}</p>
                        <p className="text-xs text-white/50">{storeName} • {itemsCount} items</p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm font-semibold text-white">₹{order.totalAmount || order.amount || 0}</p>
                      <div className="flex items-center justify-end gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          order.status === 'DELIVERED' ? 'bg-emerald-500' :
                          order.status === 'SHIPPED' ? 'bg-blue-500' :
                          'bg-[#F5C518]'
                        }`} />
                        <span className="text-[11px] text-white/50 uppercase">
                          {order.status || 'PENDING'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
