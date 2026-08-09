import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Search, Plus, Play, MoreVertical, Film, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function Reels() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isApiMissing, setIsApiMissing] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [productId, setProductId] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Fetch Reels
  const { data: reels = [], isLoading: isReelsLoading } = useQuery({
    queryKey: ['admin-reels'],
    queryFn: async () => {
      try {
        const res = await api.get('/admin/reels');
        setIsApiMissing(false);
        if (res?.data?.data && Array.isArray(res.data.data)) return res.data.data;
        if (res?.data && Array.isArray(res.data)) return res.data;
        return [];
      } catch (err: any) {
        if (err?.response?.status === 404) {
          setIsApiMissing(true);
        }
        return [];
      }
    }
  });

  // Fetch Products for tagging
  const { data: products = [] } = useQuery({
    queryKey: ['admin-products-list'],
    queryFn: async () => {
      try {
        const res = await api.get('/admin/products');
        if (res?.data?.data && Array.isArray(res.data.data)) return res.data.data;
        if (res?.data?.products && Array.isArray(res.data.products)) return res.data.products;
        if (res?.data && Array.isArray(res.data)) return res.data;
        return [];
      } catch (_err) {
        return [];
      }
    }
  });

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      return await api.post('/admin/reels', payload);
    },
    onSuccess: () => {
      toast.success('Reel created successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-reels'] });
      resetUpload(false);
    },
    onError: (err: any) => {
      console.error('Create reel error:', err);
      toast.error(err.response?.data?.message || 'Failed to create reel');
    }
  });

  const filteredReels = reels.filter((r: any) => (r.title || '').toLowerCase().includes(search.toLowerCase()) || (r.description || '').toLowerCase().includes(search.toLowerCase()));

  const handleSave = () => {
    if (!title || !videoUrl || !thumbnail) {
      toast.error('Title, Video URL, and Thumbnail are required');
      return;
    }

    createMutation.mutate({
      title,
      description,
      videoUrl,
      thumbnail,
      productId: productId || undefined,
      isActive
    });
  };

  const resetUpload = (open: boolean) => {
    setIsUploadOpen(open);
    if (!open) {
      setTimeout(() => {
        setTitle('');
        setDescription('');
        setVideoUrl('');
        setThumbnail('');
        setProductId('');
        setIsActive(true);
      }, 300);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-8">
      {isApiMissing && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-red-500">Backend Missing</h3>
            <p className="text-xs text-red-400/90 mt-1">The Reels API (/admin/reels) is currently returning 404 from the server. Reels cannot be saved or fetched.</p>
          </div>
        </div>
      )}
      
      <div className="page-header">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Reels</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage video content and shoppable reels for the customer app.</p>
        </div>
        
        <Dialog open={isUploadOpen} onOpenChange={resetUpload}>
          <DialogTrigger className="text-xs font-medium h-8 px-3 inline-flex items-center justify-center rounded-md text-primary-foreground bg-primary hover:bg-primary/90 outline-none cursor-pointer">
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Create Reel
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-[#0A0A0A] border-white/[0.06]">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-white">Create New Reel</DialogTitle>
              <DialogDescription className="text-xs text-white/30">Add a new vertical video to your store's feed.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-3">
              
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-white/40">Title *</Label>
                <Input 
                  placeholder="E.g. Summer Look" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)}
                  className="bg-white/[0.03] border-white/[0.06] h-9 text-sm placeholder:text-white/15" 
                  disabled={createMutation.isPending} 
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-white/40">Description</Label>
                <Textarea 
                  placeholder="Casual summer outfit..." 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="resize-none bg-white/[0.03] border-white/[0.06] h-20 text-sm placeholder:text-white/15" 
                  disabled={createMutation.isPending} 
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-white/40">Video URL (MP4/WebM) *</Label>
                <Input 
                  placeholder="https://..." 
                  value={videoUrl} 
                  onChange={e => setVideoUrl(e.target.value)}
                  className="bg-white/[0.03] border-white/[0.06] h-9 text-sm placeholder:text-white/15" 
                  disabled={createMutation.isPending} 
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-white/40">Thumbnail URL (JPG/PNG) *</Label>
                <Input 
                  placeholder="https://..." 
                  value={thumbnail} 
                  onChange={e => setThumbnail(e.target.value)}
                  className="bg-white/[0.03] border-white/[0.06] h-9 text-sm placeholder:text-white/15" 
                  disabled={createMutation.isPending} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-white/40">Tag Product</Label>
                  <Select value={productId} onValueChange={(val) => setProductId(val || '')} disabled={createMutation.isPending}>
                    <SelectTrigger className="bg-white/[0.03] border-white/[0.06] h-9 text-xs">
                      <SelectValue placeholder="Select Product" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0A0A0A] border-white/[0.06] max-h-60">
                      <SelectItem value="none" className="text-white/40">None</SelectItem>
                      {products.map((p: any) => (
                        <SelectItem key={p.id || p._id} value={p.id || p._id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1.5 flex flex-col justify-end">
                  <Label className="text-xs font-medium text-white/40 mb-2">Visibility</Label>
                  <div className="flex items-center gap-2 h-9">
                    <Switch 
                      checked={isActive} 
                      onCheckedChange={setIsActive} 
                      disabled={createMutation.isPending}
                    />
                    <span className="text-xs text-white/60">{isActive ? 'Published' : 'Draft'}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4 border-t border-white/[0.04]">
                <Button variant="outline" onClick={() => resetUpload(false)} disabled={createMutation.isPending} className="text-xs h-8 bg-white/[0.03] border-white/[0.06] text-white/50">Cancel</Button>
                <Button 
                  onClick={handleSave} 
                  disabled={createMutation.isPending}
                  className="text-xs h-8 min-w-[100px]"
                >
                  {createMutation.isPending ? <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Saving...</> : 'Save Reel'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="search-bar max-w-sm">
        <Search className="h-3.5 w-3.5 text-white/20 shrink-0" />
        <input 
          placeholder="Search reels by title or description..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-0 outline-none text-sm text-white/80 placeholder:text-white/20 w-full"
        />
      </div>

      {/* Grid */}
      {isReelsLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filteredReels.map((reel: any) => (
            <div key={reel.id || reel._id} className="group rounded-xl overflow-hidden bg-[#0A0A0A] border border-white/[0.04] hover:border-white/[0.08] transition-all duration-200">
              <div className="relative aspect-[9/16] bg-black border-b border-white/[0.04]">
                {reel.thumbnail ? (
                  <img src={reel.thumbnail} alt="Thumbnail" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300 group-hover:scale-[1.02]" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white/[0.02]">
                    <Film className="h-8 w-8 text-white/10" />
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <a href={reel.videoUrl} target="_blank" rel="noreferrer" className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transform scale-75 group-hover:scale-100 transition-all duration-300 hover:bg-white/30">
                    <Play className="h-4 w-4 text-white ml-0.5" />
                  </a>
                </div>
                
                {/* Status badge */}
                <div className="absolute top-2 left-2">
                  <span className={`text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-md ${
                    reel.isActive ? 'bg-primary/90 text-black' : 'bg-white/80 text-black'
                  }`}>
                    {reel.isActive ? 'PUBLISHED' : 'DRAFT'}
                  </span>
                </div>

                {/* More button */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="h-7 w-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white">
                    <MoreVertical className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Tagged Product */}
                {reel.productId && (
                  <div className="absolute bottom-2 right-2">
                    <span className="bg-black/60 backdrop-blur-md text-[9px] font-bold text-white/80 px-2 py-1 rounded-full border border-white/10">
                      🛍️ Tagged
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-3 space-y-1">
                <p className="text-xs font-semibold text-white/90 line-clamp-1">
                  {reel.title || 'Untitled Reel'}
                </p>
                <p className="text-[11px] text-white/50 line-clamp-2 leading-relaxed group-hover:text-white/70 transition-colors">
                  {reel.description || 'No description provided.'}
                </p>
              </div>
            </div>
          ))}
          {filteredReels.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <Film className="h-8 w-8 mx-auto mb-3 text-white/10" strokeWidth={1.5} />
              <p className="text-xs text-white/25">No reels found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
