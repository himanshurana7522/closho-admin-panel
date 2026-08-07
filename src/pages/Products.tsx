import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, MoreHorizontal, Edit, Trash2, PackageSearch } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '@/components/ui/empty-state';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';

export function Products() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const res = await api.get('/admin/products');
      if (!res?.data) return [];
      if (Array.isArray(res.data.data)) return res.data.data;
      if (res.data.data && Array.isArray(res.data.data.products)) return res.data.data.products;
      if (Array.isArray(res.data.products)) return res.data.products;
      if (Array.isArray(res.data)) return res.data;
      return [];
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/products/${id}`);
    },
    onSuccess: (_, _id) => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product deleted successfully.');
    },
    onError: () => {
      toast.error('Failed to delete product.');
    }
  });

  const products = data || [];

  const filteredProducts = products.filter(
    (product: any) =>
      String(product?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      String(product?.category?.name || product?.category || '').toLowerCase().includes(search.toLowerCase()) ||
      String(product?.id || product?._id || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Products</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage your catalog, inventory, and pricing.</p>
        </div>
        
        <Button onClick={() => navigate('/products/new')} className="text-xs font-medium h-8 px-3 flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="search-bar max-w-md">
        <div className="relative flex-1 w-full flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-white/20" />
          <Input 
            placeholder="Search products by name, SKU, or category..." 
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
          Failed to load products.
        </div>
      ) : filteredProducts.length === 0 ? (
        <EmptyState 
          icon={PackageSearch}
          title="No products found"
          description={search ? `No products match your search "${search}"` : "You haven't added any products yet."}
          action={
            search ? (
              <Button variant="outline" onClick={() => setSearch('')}>Clear Search</Button>
            ) : (
              <Button onClick={() => navigate('/products/new')}>Create Your First Product</Button>
            )
          }
        />
      ) : (
        <div className="bg-[#0A0A0A] border border-white/[0.04] rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-white/[0.04] hover:bg-transparent">
                <TableHead className="h-10 px-4 pl-5 text-[11px] font-medium uppercase tracking-wider text-white/25">Product</TableHead>
                <TableHead className="h-10 px-4 text-[11px] font-medium uppercase tracking-wider text-white/25">Category</TableHead>
                <TableHead className="h-10 px-4 text-[11px] font-medium uppercase tracking-wider text-white/25">Price</TableHead>
                <TableHead className="h-10 px-4 text-[11px] font-medium uppercase tracking-wider text-white/25">Total Stock</TableHead>
                <TableHead className="h-10 px-4 text-[11px] font-medium uppercase tracking-wider text-white/25">Status</TableHead>
                <TableHead className="h-10 px-4 pr-5 text-right text-[11px] font-medium uppercase tracking-wider text-white/25">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product: any) => {
                const productId = product.id || product._id;
                const categoryName = typeof product.category === 'object' ? product.category?.name : product.category;
                const status = product.status || (product.isActive ? 'ACTIVE' : 'DRAFT');
                const image = product.thumbnail || product.images?.[0] || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&q=80';
                // stock could be product.stock or sum of variants stock
                const stock = typeof product.stock === 'number' ? product.stock : (product.variants?.reduce((acc: any, v: any) => acc + (v.stock || 0), 0) || 0);

                return (
                <TableRow key={productId} className="border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors group">
                  <TableCell className="px-4 py-3 pl-5">
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-12 rounded-md overflow-hidden border border-border bg-muted/50">
                        <img src={image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{product.name}</div>
                        <div className="text-xs text-muted-foreground font-mono mt-0.5">{productId}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <span className="inline-flex items-center rounded-md bg-secondary/50 px-2 py-1 text-xs font-medium text-secondary-foreground ring-1 ring-inset ring-border/50">
                      {categoryName || 'Uncategorized'}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium">₹{product.price?.toLocaleString() || 0}</TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${
                        stock > 50 ? 'bg-green-500' : 
                        stock > 0 ? 'bg-yellow-500' : 'bg-destructive animate-pulse'
                      }`} />
                      <span className={stock === 0 ? 'text-destructive font-semibold' : 'font-medium'}>
                        {stock} units
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge 
                      variant="outline"
                      className={
                        status === 'ACTIVE' ? 'text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border-none' : 
                        status === 'DRAFT' ? 'text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground border-none' : 
                        'text-[10px] font-medium px-2 py-0.5 rounded-full bg-destructive/10 text-destructive border-none'
                      }
                    >
                      {status?.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 pr-5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-white/[0.04] opacity-0 group-hover:opacity-100 transition-all">
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem onClick={() => navigate(`/products/${productId}/edit`)} className="cursor-pointer">
                          <Edit className="h-4 w-4 mr-2" /> Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(productId, product.name)}
                          className="text-destructive focus:text-destructive cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete Product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
