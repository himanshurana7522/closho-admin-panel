import { useState, useEffect } from 'react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, UploadCloud, Download, Save, AlertCircle, TrendingDown, Store } from 'lucide-react';
import { toast } from 'sonner';

import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';

interface StockItem {
  id: string;
  product: string;
  sku: string;
  variant: string;
  stock: number;
  threshold: number;
}

export function Stock() {
  const [store, setStore] = useState('store_1');
  const [search, setSearch] = useState('');
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-stock', store],
    queryFn: async () => {
      const res = await api.get('/admin/stock');
      const items = res?.data?.data || res?.data || [];
      return items.map((item: any) => ({
        id: item.id,
        product: item.product?.name || 'Unknown Product',
        sku: item.sku,
        variant: `${item.color || ''} ${item.size || ''}`.trim() || 'N/A',
        stock: item.stock,
        threshold: 10
      }));
    }
  });

  // Sync data to local state when it loads
  useEffect(() => {
    if (data) {
      setStocks(data);
      setHasChanges(false);
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: async (updatedStocks: StockItem[]) => {
      // Best effort payload for bulk update
      const payload = {
        items: updatedStocks.map(s => ({ id: s.id, stock: s.stock }))
      };
      await api.post('/admin/stock/bulk', payload);
    },
    onSuccess: () => {
      toast.success('Inventory levels updated successfully!');
      setHasChanges(false);
      refetch();
    },
    onError: () => {
      toast.error('Failed to update inventory');
    }
  });

  const filteredStocks = stocks.filter(
    (stock) =>
      stock.product.toLowerCase().includes(search.toLowerCase()) ||
      stock.sku.toLowerCase().includes(search.toLowerCase())
  );

  const handleStockChange = (id: string, newStock: string) => {
    const value = parseInt(newStock) || 0;
    setStocks(stocks.map(s => s.id === id ? { ...s, stock: value } : s));
    setHasChanges(true);
  };

  const handleThresholdChange = (id: string, newThreshold: string) => {
    const value = parseInt(newThreshold) || 0;
    setStocks(stocks.map(s => s.id === id ? { ...s, threshold: value } : s));
    setHasChanges(true);
  };

  const handleSave = () => {
    saveMutation.mutate(stocks);
  };

  const lowStockCount = stocks.filter(s => s.stock > 0 && s.stock <= s.threshold).length;
  const outOfStockCount = stocks.filter(s => s.stock === 0).length;
  const totalValue = stocks.reduce((acc, curr) => acc + curr.stock, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Stock Management</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage inventory levels across your physical stores.</p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="text-xs font-medium h-8 px-3 flex-1 sm:flex-none flex items-center gap-2 border-border/50 bg-card hover:bg-muted">
            <Download className="h-4 w-4" /> <span className="hidden sm:inline">Export</span>
          </Button>
          <Button variant="outline" className="text-xs font-medium h-8 px-3 flex-1 sm:flex-none flex items-center gap-2 border-border/50 bg-card hover:bg-muted">
            <UploadCloud className="h-4 w-4" /> <span className="hidden sm:inline">Import CSV</span>
          </Button>
          <Button 
            className="text-xs font-medium h-8 px-3 flex-1 sm:flex-none flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 min-w-[140px] shadow-md transition-all"
            onClick={handleSave}
            disabled={!hasChanges || saveMutation.isPending}
          >
            {saveMutation.isPending ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
            ) : (
              <><Save className="h-4 w-4" /> Save Changes</>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-[#0A0A0A] border border-white/[0.04] rounded-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-full -mr-8 -mt-8" />
          <div className="p-6 pb-2 flex flex-row items-center justify-between relative z-10">
            <h3 className="text-sm font-medium text-muted-foreground">Total Units</h3>
            <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
              <Store className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div className="p-6 pt-0 relative z-10">
            <div className="text-2xl font-bold">{totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Across {stocks.length} variants</p>
          </div>
        </div>
        <div className="bg-[#0A0A0A] border border-white/[0.04] rounded-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-yellow-500/5 rounded-full -mr-8 -mt-8" />
          <div className="p-6 pb-2 flex flex-row items-center justify-between relative z-10">
            <h3 className="text-sm font-medium text-muted-foreground">Low Stock Alerts</h3>
            <div className="h-8 w-8 rounded-md bg-yellow-500/10 flex items-center justify-center">
              <TrendingDown className="h-4 w-4 text-yellow-500" />
            </div>
          </div>
          <div className="p-6 pt-0 relative z-10">
            <div className="text-2xl font-bold text-yellow-500">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Items near threshold</p>
          </div>
        </div>
        <div className="bg-[#0A0A0A] border border-white/[0.04] rounded-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-destructive/10 rounded-full -mr-8 -mt-8" />
          <div className="p-6 pb-2 flex flex-row items-center justify-between relative z-10">
            <h3 className="text-sm font-medium text-destructive">Out of Stock</h3>
            <div className="h-8 w-8 rounded-md bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-destructive" />
            </div>
          </div>
          <div className="p-6 pt-0 relative z-10">
            <div className="text-2xl font-bold text-destructive">{outOfStockCount}</div>
            <p className="text-xs text-destructive/80 mt-1">Immediate action required</p>
          </div>
        </div>
      </div>

      <div className="bg-[#0A0A0A] border border-white/[0.04] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/[0.04] bg-transparent">
          <div className="flex flex-col md:flex-row gap-5 items-end md:items-center justify-between">
            <div className="space-y-2 w-full md:w-auto">
              <label className="text-sm font-semibold">Select Store Location</label>
              <Select value={store} onValueChange={(val) => val && setStore(val)}>
                <SelectTrigger className="w-full md:w-[320px] bg-background focus:ring-primary shadow-sm border-border/60">
                  <SelectValue placeholder="Select a store" />
                </SelectTrigger>
                <SelectContent className="border-border">
                  <SelectItem value="store_1">Closho Downtown (Main)</SelectItem>
                  <SelectItem value="store_2">Closho Bandra</SelectItem>
                  <SelectItem value="store_3">Closho Andheri</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="search-bar max-w-md flex items-center w-full md:w-[350px]">
              <div className="relative flex-1 w-full flex items-center">
                <Search className="absolute left-3 h-4 w-4 text-white/20" />
                <Input 
                  placeholder="Search SKU or product..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 border-0 bg-transparent focus-visible:ring-0 shadow-none h-8 text-sm placeholder:text-white/20" 
                />
              </div>
            </div>
          </div>
        </div>
        <div className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-white/[0.04] hover:bg-transparent">
                  <TableHead className="h-10 px-4 pl-5 text-[11px] font-medium uppercase tracking-wider text-white/25">Product</TableHead>
                  <TableHead className="h-10 px-4 text-[11px] font-medium uppercase tracking-wider text-white/25">SKU</TableHead>
                  <TableHead className="h-10 px-4 text-[11px] font-medium uppercase tracking-wider text-white/25">Variant</TableHead>
                  <TableHead className="h-10 px-4 text-[11px] font-medium uppercase tracking-wider text-white/25 w-[180px]">Current Stock</TableHead>
                  <TableHead className="h-10 px-4 text-[11px] font-medium uppercase tracking-wider text-white/25 w-[180px]">Low Threshold</TableHead>
                  <TableHead className="h-10 px-4 pr-5 text-right text-[11px] font-medium uppercase tracking-wider text-white/25">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-6 w-6 animate-spin text-primary/50" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-red-400">
                      Failed to load stock.
                    </TableCell>
                  </TableRow>
                ) : filteredStocks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      No stock items match your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStocks.map((item) => (
                    <TableRow key={item.id} className="border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors group">
                      <TableCell className="px-4 py-3 pl-5 font-medium text-foreground">{item.product}</TableCell>
                      <TableCell className="px-4 py-3 font-mono text-xs text-muted-foreground">{item.sku}</TableCell>
                      <TableCell className="px-4 py-3">
                        <span className="inline-flex items-center rounded-md bg-secondary/50 px-2 py-1 text-xs font-medium text-secondary-foreground ring-1 ring-inset ring-border/50">
                          {item.variant}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="relative">
                          <Input 
                            type="number" 
                            value={item.stock} 
                            onChange={(e) => handleStockChange(item.id, e.target.value)}
                            className={`h-9 bg-background shadow-sm transition-colors ${
                              item.stock === 0 ? 'border-destructive focus-visible:ring-destructive text-destructive font-bold bg-destructive/5' : 
                              item.stock <= item.threshold ? 'border-yellow-500/50 focus-visible:ring-yellow-500 text-yellow-500 font-bold bg-yellow-500/5' : 
                              'border-border/60 focus-visible:ring-primary'
                            }`}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Input 
                          type="number" 
                          value={item.threshold} 
                          onChange={(e) => handleThresholdChange(item.id, e.target.value)}
                          className="h-9 bg-background shadow-sm border-border/60 focus-visible:ring-primary text-muted-foreground"
                        />
                      </TableCell>
                      <TableCell className="px-4 py-3 pr-5 text-right">
                        {item.stock === 0 ? (
                          <Badge variant="destructive" className="inline-flex items-center gap-1.5 shadow-sm w-28 justify-center border-none">
                            <AlertCircle className="h-3.5 w-3.5" /> Out of Stock
                          </Badge>
                        ) : item.stock <= item.threshold ? (
                          <Badge variant="outline" className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 border-none inline-flex items-center gap-1.5 w-28 justify-center">
                            <TrendingDown className="h-3.5 w-3.5" /> Low Stock
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border-none inline-flex items-center justify-center w-28">
                            In Stock
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
