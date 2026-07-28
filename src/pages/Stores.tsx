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

// Mock data
const MOCK_STORES = [
  { id: '1', name: 'Closho Downtown', address: '123 Main St', city: 'Mumbai', pincode: '400001', status: 'ACTIVE', radius: 5 },
  { id: '2', name: 'Closho Bandra', address: '45 Linking Rd', city: 'Mumbai', pincode: '400050', status: 'ACTIVE', radius: 3 },
  { id: '3', name: 'Closho Andheri', address: '78 Lokhandwala', city: 'Mumbai', pincode: '400053', status: 'INACTIVE', radius: 4 },
];

export function Stores() {
  const { user } = useAuthStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [stores, setStores] = useState(MOCK_STORES);
  const [search, setSearch] = useState('');

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(search.toLowerCase()) ||
      store.city.toLowerCase().includes(search.toLowerCase()) ||
      store.id.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    setStores(stores.map(store => {
      if (store.id === id) {
        const newStatus = store.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        toast.success(`Store ${store.name} marked as ${newStatus}`);
        return { ...store, status: newStatus };
      }
      return store;
    }));
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

      {filteredStores.length === 0 ? (
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
              {filteredStores.map((store) => (
                <TableRow key={store.id} className="border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors group">
                  <TableCell className="px-4 py-3 pl-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                        <StoreIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{store.name}</div>
                        <div className="text-xs text-muted-foreground font-mono mt-0.5">ID: {store.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="text-sm font-medium">{store.address}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{store.city}, {store.pincode}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge variant="outline" className="bg-background border-border/50">
                      {store.radius} km
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge 
                      variant="outline"
                      className={
                        store.status === 'ACTIVE' 
                          ? 'text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border-none' 
                          : 'text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground border-none'
                      }
                    >
                      {store.status}
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
                        onClick={() => toggleStatus(store.id)}
                        className={`h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity ${store.status === 'ACTIVE' ? 'text-destructive hover:text-destructive hover:bg-destructive/10' : 'text-primary hover:text-primary hover:bg-primary/10'}`}
                        title={store.status === 'ACTIVE' ? 'Deactivate Store' : 'Activate Store'}
                      >
                        {store.status === 'ACTIVE' ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <StoreFormDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
