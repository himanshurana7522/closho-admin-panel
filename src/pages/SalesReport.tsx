import { useState } from 'react';
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
  TrendingUp, 
  ShoppingCart, 
  Tag, 
  CreditCard,
  Loader2,
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
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export function SalesReport() {
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

  const { data: report, isLoading } = useQuery({
    queryKey: ['admin-sales-report', selectedStore],
    queryFn: async () => {
      const params = selectedStore !== 'all' ? { storeId: selectedStore } : {};
      const res = await api.get('/admin/reports/sales', { params });
      return res.data.data || res.data;
    }
  });

  const summary = report?.summary || { totalOrders: 0, totalRevenue: 0, totalDiscount: 0, averageOrderValue: 0 };
  const dailyBreakdown = report?.dailyBreakdown || [];
  const paymentBreakdown = report?.paymentBreakdown || [];

  const PIE_COLORS = ['#F5C518', '#3b82f6', '#10b981', '#f43f5e'];

  if (isLoading) {
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
          <h2 className="text-2xl font-semibold tracking-tight text-white">Sales Report</h2>
          <p className="text-sm text-muted-foreground mt-1">Detailed revenue and transaction analysis.</p>
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
            <span>Last 30 Days</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#0A0A0A] border border-white/[0.04] border-l-2 border-l-[#F5C518] rounded-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-white/50">Total Revenue</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-[#F5C518]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">₹{summary.totalRevenue?.toLocaleString()}</div>
            <p className="text-xs text-white/40 mt-1">Gross sales</p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0A0A0A] border border-white/[0.04] border-l-2 border-l-blue-500 rounded-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-white/50">Total Orders</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
              <ShoppingCart className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{summary.totalOrders}</div>
            <p className="text-xs text-white/40 mt-1">Completed transactions</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0A0A0A] border border-white/[0.04] border-l-2 border-l-purple-500 rounded-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-white/50">Total Discount</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
              <Tag className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">₹{summary.totalDiscount?.toLocaleString()}</div>
            <p className="text-xs text-white/40 mt-1">Given via coupons</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0A0A0A] border border-white/[0.04] border-l-2 border-l-emerald-500 rounded-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-white/50">Average Order Value</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">₹{Math.round(summary.averageOrderValue || 0).toLocaleString()}</div>
            <p className="text-xs text-white/40 mt-1">Per transaction average</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-[#0A0A0A] border border-white/[0.04] rounded-xl">
          <CardHeader>
            <CardTitle className="text-white">Daily Sales Trend</CardTitle>
            <CardDescription className="text-white/50">Revenue and order volume over time.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyBreakdown} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
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
                    fill="url(#colorSales)" 
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#F5C518' }} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 flex flex-col bg-[#0A0A0A] border border-white/[0.04] rounded-xl">
          <CardHeader>
            <CardTitle className="text-white">Payment Methods</CardTitle>
            <CardDescription className="text-white/50">Breakdown of revenue by payment provider.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center">
            {paymentBreakdown.length > 0 ? (
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="revenue"
                      nameKey="paymentMethod"
                    >
                      {paymentBreakdown.map((_entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0A0A0A', borderColor: 'rgba(255,255,255,0.04)', borderRadius: '12px', boxShadow: '0 4px 20px -2px rgb(0 0 0 / 0.5)' }} 
                      itemStyle={{ color: '#fff', fontWeight: 600 }}
                      formatter={(value: any) => [`₹${value}`, 'Revenue']}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      formatter={(value) => <span className="text-white/70 uppercase text-xs font-semibold">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-10 text-white/40 text-sm">No payment data available</div>
            )}
            
            <div className="w-full space-y-2 mt-4">
              {paymentBreakdown.map((pb: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}></div>
                    <span className="text-sm font-medium text-white/90 uppercase">{pb.paymentMethod}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">₹{pb.revenue.toLocaleString()}</p>
                    <p className="text-xs text-white/40">{pb.count} orders</p>
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
