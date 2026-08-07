import { useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, MapPin, Edit2, Power, PowerOff, Store as StoreIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StoreFormDialog } from '@/features/stores/StoreFormDialog';
import { EmptyState } from '@/components/ui/empty-state';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';

// Mock data
export function Stores() {
  const { user } = useAuthStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-stores'],
    queryFn: async () => {
      const res = await api.get('/admin/stores');
      if (!res?.data) return [];
      if (Array.isArray(res.data.data)) return res.data.data;
      if (res.data.data && Array.isArray(res.data.data.stores)) return res.data.data.stores;
      if (Array.isArray(res.data.stores)) return res.data.stores;
      if (Array.isArray(res.data)) return res.data;
      return [];
    }
  });
  
  const stores = data || [];

  const filteredStores = stores.filter(
    (store: any) => {
      const storeName = store.name || 'Unknown Store';
      const city = store.city || '';
      const id = store.id || store._id || '';
      return String(storeName).toLowerCase().includes(search.toLowerCase()) ||
        String(city).toLowerCase().includes(search.toLowerCase()) ||
        String(id).toLowerCase().includes(search.toLowerCase());
    }
  );

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      await api.patch(`/admin/stores/${id}/status`, { status });
    },
    onSuccess: () => {
      toast.success('Store status updated');
      queryClient.invalidateQueries({ queryKey: ['admin-stores'] });
    },
    onError: () => {
      toast.error('Failed to update store status');
    }
  });

  const toggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    toggleStatusMutation.mutate({ id, status: newStatus });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Stores</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage your physical retail locations and delivery radius.</p>
        </div>
        
        {user?.role === 'SUPER_ADMIN' && (
          <Button onClick={() => setIsDialogOpen(true)} className="text-xs font-medium h-8 px-3 flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md">
            <Plus className="h-4 w-4" /> Add New Store
          </Button>
        )}
      </div>

      <div className="search-bar max-w-md flex items-center">
        <div className="relative flex-1 w-full flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-white/20" />
          <Input 
            placeholder="Search stores by name, ID or city..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 border-0 bg-transparent focus-visible:ring-0 shadow-none h-8 text-sm placeholder:text-white/20" 
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-400 bg-red-400/10 rounded-xl border border-red-400/20">
          Failed to load stores.
        </div>
      ) : filteredStores.length === 0 ? (
        <EmptyState 
          icon={StoreIcon}
          title="No stores found"
          description={search ? `No stores match your search "${search}"` : "You haven't added any stores yet."}
          action={
            search ? (
              <Button variant="outline" onClick={() => setSearch('')}>Clear Search</Button>
            ) : (
              <Button onClick={() => setIsDialogOpen(true)}>Add Your First Store</Button>
            )
          }
        />
      ) : (
        <div className="bg-[#0A0A0A] border border-white/[0.04] rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-white/[0.04] hover:bg-transparent">
                <TableHead className="h-10 px-4 pl-5 text-[11px] font-medium uppercase tracking-wider text-white/25">Store Details</TableHead>
                <TableHead className="h-10 px-4 text-[11px] font-medium uppercase tracking-wider text-white/25">Location</TableHead>
                <TableHead className="h-10 px-4 text-[11px] font-medium uppercase tracking-wider text-white/25">Delivery Radius</TableHead>
                <TableHead className="h-10 px-4 text-[11px] font-medium uppercase tracking-wider text-white/25">Status</TableHead>
                <TableHead className="h-10 px-4 pr-5 text-right text-[11px] font-medium uppercase tracking-wider text-white/25">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStores.map((store: any) => {
                const storeId = store.id || store._id;
                const storeName = store.name || 'Unknown Store';
                const status = store.status || (store.isActive ? 'ACTIVE' : 'INACTIVE');
                return (
                <TableRow key={storeId} className="border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors group">
                  <TableCell className="px-4 py-3 pl-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                        <StoreIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{storeName}</div>
                        <div className="text-xs text-muted-foreground font-mono mt-0.5">ID: {storeId}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="text-sm font-medium">{store.address || 'N/A'}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{store.city || ''}{store.pincode ? `, ${store.pincode}` : ''}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge variant="outline" className="bg-background border-border/50">
                      {store.deliveryRadiusKm || store.radius || 0} km
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge 
                      variant="outline"
                      className={
                        status === 'ACTIVE' 
                          ? 'text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border-none' 
                          : 'text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground border-none'
                      }
                    >
                      {status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 pr-5 text-right space-x-2">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    {user?.role === 'SUPER_ADMIN' && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => toggleStatus(storeId, status)}
                        disabled={toggleStatusMutation.isPending}
                        className={`h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity ${status === 'ACTIVE' ? 'text-destructive hover:text-destructive hover:bg-destructive/10' : 'text-primary hover:text-primary hover:bg-primary/10'}`}
                        title={status === 'ACTIVE' ? 'Deactivate Store' : 'Activate Store'}
                      >
                        {status === 'ACTIVE' ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <StoreFormDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
