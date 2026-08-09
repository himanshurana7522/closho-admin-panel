import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Trash2, Ticket, Percent, Check, CopyIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';

export function Coupons() {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  // Form State
  const [newCode, setNewCode] = useState('');
  const [discountType, setDiscountType] = useState('percent');
  const [discountValue, setDiscountValue] = useState('');
  
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code ${code} copied!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };
  
  const queryClient = useQueryClient();
  
  const { data: couponsData, isLoading, error } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: async () => {
      const res = await api.get('/admin/coupons');
      if (res?.data?.data && Array.isArray(res.data.data)) return res.data.data;
      if (res?.data && Array.isArray(res.data)) return res.data;
      return [];
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/coupons/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
      toast.success('Coupon deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete coupon');
    }
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        code: newCode,
        discountType,
        value: parseFloat(discountValue),
        minOrderAmount: 0,
        maxDiscount: 1000,
        validFrom: new Date().toISOString(),
        validUntil: new Date(Date.now() + 30 * 86400000).toISOString(), // 30 days
        usageLimit: 100,
        isActive: true
      };
      await api.post('/admin/coupons', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
      toast.success('Coupon created successfully');
      setIsOpen(false);
      setNewCode('');
      setDiscountValue('');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create coupon');
    }
  });

  const coupons = couponsData || [];
  
  const filteredCoupons = coupons.filter((coupon: any) => 
    coupon.code?.toLowerCase().includes(search.toLowerCase())
  );
  
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Coupons & Promotions</h2>
          <p className="text-sm text-muted-foreground mt-1">Create and manage discount codes for your customers.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger className="text-xs font-medium h-8 px-3 flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md rounded-md cursor-pointer outline-none">
              <Plus className="h-4 w-4" /> Create Coupon
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <Ticket className="h-5 w-5 text-primary" /> Create New Coupon
              </DialogTitle>
              <DialogDescription>
                Configure a new discount code for your store.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5 pt-2">
              <div className="space-y-2">
                <Label className="font-semibold">Coupon Code *</Label>
                <div className="relative">
                  <Input 
                    placeholder="e.g. SUMMER50" 
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                    className="uppercase font-mono tracking-wider focus-visible:ring-primary pl-10" 
                  />
                  <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">Customers will enter this code at checkout.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-semibold">Discount Type</Label>
                  <Select value={discountType} onValueChange={(val) => setDiscountType(val || 'percent')}>
                    <SelectTrigger className="focus:ring-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percent">Percentage (%)</SelectItem>
                      <SelectItem value="flat">Flat Amount (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold">Value *</Label>
                  <Input 
                    type="number" 
                    placeholder="50" 
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="focus-visible:ring-primary" 
                  />
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <Label className="font-semibold">Usage Limit</Label>
                <Select defaultValue="unlimited">
                  <SelectTrigger className="focus:ring-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unlimited">Unlimited Uses</SelectItem>
                    <SelectItem value="once_per_user">Once per customer</SelectItem>
                    <SelectItem value="custom">Custom Limit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="mt-6 border-t border-border/50 pt-4">
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button 
                onClick={() => createMutation.mutate()} 
                disabled={createMutation.isPending || !newCode || !discountValue}
                className="bg-primary text-primary-foreground"
              >
                {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save Coupon
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="search-bar max-w-md flex items-center">
        <div className="relative flex-1 w-full flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-white/20" />
          <Input 
            placeholder="Search coupons..." 
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
              <TableHead className="h-10 px-4 pl-5 text-[11px] font-medium uppercase tracking-wider text-white/25">Code</TableHead>
              <TableHead className="h-10 px-4 text-[11px] font-medium uppercase tracking-wider text-white/25">Discount</TableHead>
              <TableHead className="h-10 px-4 text-[11px] font-medium uppercase tracking-wider text-white/25">Usage</TableHead>
              <TableHead className="h-10 px-4 text-[11px] font-medium uppercase tracking-wider text-white/25">Status</TableHead>
              <TableHead className="h-10 px-4 pr-5 text-right text-[11px] font-medium uppercase tracking-wider text-white/25">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary/50" />
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-red-400">
                  Failed to load coupons.
                </TableCell>
              </TableRow>
            ) : filteredCoupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No coupons found.
                </TableCell>
              </TableRow>
            ) : (
              filteredCoupons.map((coupon: any) => {
                const isExpired = coupon.expiryDate && new Date(coupon.expiryDate) < new Date();
                const isActive = coupon.isActive && !isExpired;
                return (
                  <TableRow key={coupon.id} className="border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors group">
                    <TableCell className="px-4 py-3 pl-5">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center border shrink-0 ${isActive ? 'bg-primary/10 border-primary/20' : 'bg-muted border-border opacity-50'}`}>
                          <Ticket className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                        <div className={isActive ? '' : 'opacity-50'}>
                          <div className="font-mono font-bold text-foreground flex items-center gap-2">
                            {coupon.code}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" 
                              onClick={() => handleCopy(coupon.code)}
                            >
                              {copiedCode === coupon.code ? <Check className="h-3 w-3 text-green-500" /> : <CopyIcon className="h-3 w-3 text-muted-foreground" />}
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {coupon.expiryDate ? `Expires: ${new Date(coupon.expiryDate).toLocaleDateString()}` : 'No expiration'}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className={`px-4 py-3 font-medium ${isActive ? 'text-primary' : 'opacity-50'}`}>
                      {coupon.discountType === 'percent' ? `${coupon.value}% off` : `₹${coupon.value} off`}
                    </TableCell>
                    <TableCell className={`px-4 py-3 ${isActive ? '' : 'opacity-50'}`}>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">∞</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge variant="outline" className={`text-[10px] font-medium px-2 py-0.5 rounded-full border-none ${isActive ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'}`}>
                        {isActive ? 'Active' : (isExpired ? 'Expired' : 'Inactive')}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 pr-5 text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteMutation.mutate(coupon.id)}
                        disabled={deleteMutation.isPending}
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
