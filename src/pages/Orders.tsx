import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Download, Eye, FileSearch } from 'lucide-react';
import { format } from 'date-fns';
import { EmptyState } from '@/components/ui/empty-state';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';

export function Orders() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-orders', page, limit],
    queryFn: async () => {
      const res = await api.get('/admin/orders', { params: { page, limit } });
      let orders = [];
      let pagination = { totalPages: 1, currentPage: 1, totalOrders: 0 };
      
      if (res?.data) {
        if (Array.isArray(res.data.data)) orders = res.data.data;
        else if (res.data.data && Array.isArray(res.data.data.orders)) orders = res.data.data.orders;
        else if (Array.isArray(res.data.orders)) orders = res.data.orders;
        else if (Array.isArray(res.data)) orders = res.data;
        
        if (res.data.pagination) pagination = res.data.pagination;
        else if (res.data.data?.pagination) pagination = res.data.data.pagination;
      }
      return { orders, pagination };
    }
  });

  const orders = data?.orders || [];
  const pagination = data?.pagination || { totalPages: 1, currentPage: 1, totalOrders: 0 };

  const filteredOrders = orders.filter((o: any) => {
    const orderId = o.id || o._id || o.orderNumber;
    const customerName = o.user?.fullName || o.user?.name || o.shippingAddress?.fullName || 'Unknown Customer';
    
    const matchesSearch = String(orderId || '').toLowerCase().includes(search.toLowerCase()) || String(customerName || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Orders</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage and process customer orders across all stores.</p>
        </div>
        
        <Button onClick={() => toast.success('Orders exported successfully')} variant="outline" className="text-xs font-medium h-8 px-3 flex items-center gap-2 border-border/50 bg-card hover:bg-muted">
          <Download className="h-4 w-4" /> Export Orders
        </Button>
      </div>

      <div className="search-bar max-w-md flex items-center">
        <div className="relative flex-1 w-full flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-white/20" />
          <Input 
            placeholder="Search by Order ID, Customer name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 border-0 bg-transparent focus-visible:ring-0 shadow-none h-8 text-sm placeholder:text-white/20" 
          />
        </div>
        
        <div className="hidden sm:block w-px h-6 bg-border/50 mx-2"></div>
        
        <Select value={statusFilter} onValueChange={(val) => val && setStatusFilter(val)}>
          <SelectTrigger className="w-full sm:w-[150px] bg-transparent border-0 focus:ring-0 shadow-none h-8 text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="border-border">
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
            <SelectItem value="PACKED">Packed</SelectItem>
            <SelectItem value="SHIPPED">Shipped</SelectItem>
            <SelectItem value="DELIVERED">Delivered</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-400 bg-red-400/10 rounded-xl border border-red-400/20">
          Failed to load orders.
        </div>
      ) : filteredOrders.length === 0 ? (
        <EmptyState 
          icon={FileSearch}
          title="No orders found"
          description={`No orders match your current filters.`}
          action={
            <Button variant="outline" onClick={() => { setSearch(''); setStatusFilter('ALL'); }}>
              Clear Filters
            </Button>
          }
        />
      ) : (
        <div className="bg-[#0A0A0A] border border-white/[0.04] rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-white/[0.04] hover:bg-transparent">
                <TableHead className="h-10 px-4 pl-5 text-[11px] font-medium uppercase tracking-wider text-white/25">Order ID</TableHead>
                <TableHead className="h-10 px-4 text-[11px] font-medium uppercase tracking-wider text-white/25">Date & Time</TableHead>
                <TableHead className="h-10 px-4 text-[11px] font-medium uppercase tracking-wider text-white/25">Customer</TableHead>
                <TableHead className="h-10 px-4 text-[11px] font-medium uppercase tracking-wider text-white/25">Store</TableHead>
                <TableHead className="h-10 px-4 text-[11px] font-medium uppercase tracking-wider text-white/25">Total</TableHead>
                <TableHead className="h-10 px-4 text-[11px] font-medium uppercase tracking-wider text-white/25">Status</TableHead>
                <TableHead className="h-10 px-4 pr-5 text-right text-[11px] font-medium uppercase tracking-wider text-white/25">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order: any) => {
                const orderId = order.id || order._id || order.orderNumber;
                const customerName = order.user?.fullName || order.user?.name || order.shippingAddress?.fullName || 'Unknown';
                const orderDate = new Date(order.createdAt || order.date || Date.now());
                const storeName = order.store?.name || order.store || 'Main Store';
                const total = typeof order.total === 'number' ? order.total : (order.amount || 0);
                const paymentMethod = order.payment?.method || order.paymentMethod || order.payment || 'N/A';
                
                const statusColors: Record<string, string> = {
                  PENDING: 'bg-yellow-500/10 text-yellow-500 border-none',
                  CONFIRMED: 'bg-blue-500/10 text-blue-500 border-none',
                  PACKED: 'bg-indigo-500/10 text-indigo-500 border-none',
                  SHIPPED: 'bg-purple-500/10 text-purple-500 border-none',
                  DELIVERED: 'bg-green-500/10 text-green-500 border-none',
                  CANCELLED: 'bg-destructive/10 text-destructive border-none',
                  RETURNED: 'bg-orange-500/10 text-orange-500 border-none',
                };
                
                return (
                <TableRow key={orderId} className="border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors group">
                  <TableCell className="px-4 py-3 pl-5">
                    <div className="font-semibold text-foreground">{orderId}</div>
                    <Badge variant="outline" className="mt-1 text-[10px] bg-background border-border/50">
                      {paymentMethod}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="text-sm font-medium">{format(orderDate, 'MMM dd, yyyy')}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      {format(orderDate, 'hh:mm a')}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase border border-primary/20">
                        {customerName.substring(0, 2)}
                      </div>
                      <span className="font-medium">{customerName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-muted-foreground text-sm">{storeName}</TableCell>
                  <TableCell className="px-4 py-3 font-semibold">₹{total.toLocaleString()}</TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge variant="outline" className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColors[order.status?.toUpperCase()] || statusColors.PENDING} transition-colors`}>
                      {order.status || 'PENDING'}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 pr-5 text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => navigate(`/orders/${orderId}`)}
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/20 hover:text-primary"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.04] bg-[#0A0A0A]">
              <div className="text-sm text-white/50">
                Showing page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalOrders || orders.length} total orders)
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="h-8 border-border/50 bg-transparent hover:bg-white/[0.04]"
                >
                  Previous
                </Button>
                <div className="text-sm font-medium text-white px-2">
                  {page}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                  disabled={page >= pagination.totalPages}
                  className="h-8 border-border/50 bg-transparent hover:bg-white/[0.04]"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
