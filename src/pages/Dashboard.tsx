import { toast } from 'sonner';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  AlertCircle, 
  Store,
  Calendar as CalendarIcon,
  ChevronDown
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

const data = [
  { name: 'Mon', revenue: 4000, orders: 24 },
  { name: 'Tue', revenue: 3000, orders: 18 },
  { name: 'Wed', revenue: 5000, orders: 32 },
  { name: 'Thu', revenue: 2780, orders: 15 },
  { name: 'Fri', revenue: 6890, orders: 48 },
  { name: 'Sat', revenue: 8390, orders: 60 },
  { name: 'Sun', revenue: 7490, orders: 52 },
];

export function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-1">Welcome back. Here is what's happening with your stores today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 bg-white/[0.03] border-white/[0.06] text-white/60 hover:bg-white/[0.06] hover:text-white/80 transition-all duration-200 rounded-lg">
            <CalendarIcon className="h-4 w-4" />
            <span>Last 7 Days</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button onClick={() => toast.success('Report download started')} className="bg-[#F5C518] text-black hover:bg-[#F5C518]/90 font-medium rounded-lg transition-all duration-200">
            Download Report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        <Card className="bg-[#0A0A0A] border border-white/[0.04] border-l-2 border-l-[#F5C518] rounded-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-white/50">Total Revenue</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-[#F5C518]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">₹45,231.89</div>
            <p className="text-xs text-green-500 mt-1 flex items-center gap-1 font-medium">
              <TrendingUp className="h-3 w-3" />
              +20.1% <span className="text-white/40 font-normal">from last week</span>
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
            <div className="text-3xl font-bold text-white">+2350</div>
            <p className="text-xs text-green-500 mt-1 flex items-center gap-1 font-medium">
              <TrendingUp className="h-3 w-3" />
              +15.2% <span className="text-white/40 font-normal">from last week</span>
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
            <div className="text-3xl font-bold text-white">12</div>
            <p className="text-xs text-white/40 mt-1">
              3 pending approval
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
            <div className="text-3xl font-bold text-white">12,234</div>
            <p className="text-xs text-white/40 mt-1">
              +19 new this week
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
            <div className="text-3xl font-bold text-white">24</div>
            <p className="text-xs text-red-400 mt-1">
              Items need restocking
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
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F5C518" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#F5C518" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
                  <XAxis 
                    dataKey="name" 
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
              {[
                { id: 1024, store: 'Closho Bandra', items: 3, amount: 4500, status: 'Processing', time: '10 mins ago' },
                { id: 1023, store: 'Closho Andheri', items: 1, amount: 1200, status: 'Shipped', time: '1 hour ago' },
                { id: 1022, store: 'Closho Juhu', items: 4, amount: 8900, status: 'Delivered', time: '3 hours ago' },
                { id: 1021, store: 'Closho Bandra', items: 2, amount: 3200, status: 'Delivered', time: '5 hours ago' },
                { id: 1020, store: 'Closho Colaba', items: 1, amount: 999, status: 'Processing', time: '6 hours ago' },
              ].map((order, i) => (
                <div key={i} className="flex items-center justify-between group p-3 hover:bg-white/[0.02] rounded-xl transition-all duration-200 border border-transparent hover:border-white/[0.04]">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center transition-colors group-hover:bg-white/[0.06]">
                      <ShoppingCart className="h-4 w-4 text-white/60 group-hover:text-white/90" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold leading-none text-white">Order #ORD-{order.id}</p>
                      <p className="text-xs text-white/50">{order.store} • {order.items} items</p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-semibold text-white">₹{order.amount}</p>
                    <div className="flex items-center justify-end gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        order.status === 'Delivered' ? 'bg-emerald-500' :
                        order.status === 'Shipped' ? 'bg-blue-500' :
                        'bg-[#F5C518]'
                      }`} />
                      <span className="text-[11px] text-white/50">
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
