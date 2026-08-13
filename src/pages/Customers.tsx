import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Mail, Phone, ExternalLink, ArrowUpRight, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function Customers() {
  const [search, setSearch] = useState('');
  
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['admin-customers'],
    queryFn: async () => {
      try {
        const res = await api.get('/admin/customers');
        if (res?.data?.data && Array.isArray(res.data.data)) return res.data.data;
        if (res?.data?.customers && Array.isArray(res.data.customers)) return res.data.customers;
        if (res?.data && Array.isArray(res.data)) return res.data;
        return [];
      } catch (err) {
        return [];
      }
    }
  });

  const filteredCustomers = customers.filter(
    (customer: any) => {
      const name = customer.fullName || customer.name || '';
      const email = customer.email || '';
      const phone = customer.phone_no || customer.phone || '';
      return name.toLowerCase().includes(search.toLowerCase()) ||
        email.toLowerCase().includes(search.toLowerCase()) ||
        phone.includes(search);
    }
  );

  
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Customers</h2>
          <p className="text-sm text-muted-foreground mt-1">View and manage customer data, order history, and preferences.</p>
        </div>
      </div>

      <div className="search-bar max-w-md flex items-center">
        <div className="relative flex-1 w-full flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-white/20" />
          <Input 
            placeholder="Search customers by name, email, or phone..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 border-0 bg-transparent focus-visible:ring-0 shadow-none h-8 text-sm placeholder:text-white/20" 
          />
        </div>
      </div>

      <div className="bg-[#0A0A0A] border border-white/[0.04] rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-white/[0.04] hover:bg-transparent">
              <TableHead className="h-10 px-4 pl-5 text-[11px] font-medium uppercase tracking-wider text-white/25">Customer</TableHead>
              <TableHead className="h-10 px-4 text-[11px] font-medium uppercase tracking-wider text-white/25">Contact Info</TableHead>
              <TableHead className="h-10 px-4 text-center text-[11px] font-medium uppercase tracking-wider text-white/25">Total Orders</TableHead>
              <TableHead className="h-10 px-4 text-[11px] font-medium uppercase tracking-wider text-white/25">Total Spent</TableHead>
              <TableHead className="h-10 px-4 pr-5 text-right text-[11px] font-medium uppercase tracking-wider text-white/25">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  {isLoading ? (
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" /> Loading customers...
                    </div>
                  ) : (
                    "No customers found."
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer: any) => {
                const name = customer.fullName || customer.name || 'Unknown User';
                const initial = name.substring(0, 1).toUpperCase();
                const colors = ['blue', 'emerald', 'purple', 'rose', 'amber'];
                const color = colors[name.length % colors.length];
                
                return (
                <TableRow key={customer.id || customer._id} className="border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors group">
                  <TableCell className="px-4 py-3 pl-5">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full bg-${color}-500/10 flex items-center justify-center text-${color}-500 font-bold border border-${color}-500/20 shrink-0`}>
                        {initial}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground flex items-center gap-2">
                          {name}
                          {customer.isVip && (
                            <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 hover:bg-yellow-500/20">
                              <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" /> VIP
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">Joined {new Date(customer.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="text-sm font-medium flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" /> {customer.email || 'No email'}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                      <Phone className="h-3.5 w-3.5" /> {customer.phone_no || customer.phone || 'No phone'}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center font-medium">{customer.totalOrders || customer.ordersCount || 0}</TableCell>
                  <TableCell className="px-4 py-3 font-semibold text-primary">₹{customer.totalSpent || 0}</TableCell>
                  <TableCell className="px-4 py-3 pr-5 text-right">
                    <Button variant="ghost" size="sm" className="text-xs font-medium h-8 px-3 text-primary hover:text-primary hover:bg-primary/10 group-hover:flex hidden items-center gap-1.5 ml-auto">
                      View Profile <ArrowUpRight className="h-4 w-4" />
                    </Button>
                    <div className="h-8 flex items-center justify-end group-hover:hidden">
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </TableCell>
                </TableRow>
              )})
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
