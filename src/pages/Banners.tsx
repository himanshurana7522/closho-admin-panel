import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Image as ImageIcon, Edit, Trash2, Link as LinkIcon, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import api from '@/lib/api';

export function Banners() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isApiMissing, setIsApiMissing] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [link, setLink] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [orderIndex, setOrderIndex] = useState(0);

  // Fetch Banners
  const { data: banners = [], isLoading } = useQuery({
    queryKey: ['admin-banners'],
    queryFn: async () => {
      try {
        const res = await api.get('/admin/banners');
        setIsApiMissing(false);
        if (res?.data?.data && Array.isArray(res.data.data)) return res.data.data;
        if (res?.data?.banners && Array.isArray(res.data.banners)) return res.data.banners;
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

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (editingId) {
        return await api.put(`/admin/banners/${editingId}`, payload);
      }
      return await api.post('/admin/banners', payload);
    },
    onSuccess: () => {
      toast.success(editingId ? 'Banner updated successfully!' : 'Banner created successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
      closeDialog();
    },
    onError: (err: any) => {
      console.error('Save banner error:', err);
      toast.error(err.response?.data?.message || 'Failed to save banner');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/admin/banners/${id}`);
    },
    onSuccess: () => {
      toast.success('Banner deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete banner');
    }
  });

  const handleSave = () => {
    if (!title.trim() || !imageUrl.trim()) {
      toast.error('Title and Image URL are required');
      return;
    }
    const payload = {
      title,
      imageUrl,
      link,
      isActive,
      orderIndex: Number(orderIndex)
    };
    saveMutation.mutate(payload);
  };

  const openEdit = (banner: any) => {
    setEditingId(banner.id || banner._id);
    setTitle(banner.title || '');
    setImageUrl(banner.imageUrl || '');
    setLink(banner.link || '');
    setIsActive(banner.isActive !== false);
    setOrderIndex(banner.orderIndex || 0);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setTimeout(() => {
      setEditingId(null);
      setTitle('');
      setImageUrl('');
      setLink('');
      setIsActive(true);
      setOrderIndex(0);
    }, 300);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-8">
      {isApiMissing && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-red-500">Backend Missing</h3>
            <p className="text-xs text-red-400/90 mt-1">The Banners API (/admin/banners) is returning 404. Banners cannot be saved or fetched.</p>
          </div>
        </div>
      )}

      <div className="page-header">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Banners</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage promotional banners on the app homepage.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger className="text-xs font-medium h-8 px-3 inline-flex items-center justify-center rounded-md text-primary-foreground bg-primary hover:bg-primary/90 outline-none cursor-pointer" onClick={() => {
              setEditingId(null);
              setTitle('');
              setImageUrl('');
              setLink('');
              setIsActive(true);
              setOrderIndex(0);
            }}>
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Banner
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px] bg-[#0A0A0A] border-white/[0.06]">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-white">{editingId ? 'Edit Banner' : 'Create Banner'}</DialogTitle>
              <DialogDescription className="text-xs text-white/40">
                Showcase campaigns or categories on the home screen.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-white/40">Title *</Label>
                <Input 
                  placeholder="e.g. Winter Sale" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="bg-white/[0.03] border-white/[0.06] h-9 text-sm placeholder:text-white/15"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-white/40">Image URL *</Label>
                <Input 
                  placeholder="https://..." 
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  className="bg-white/[0.03] border-white/[0.06] h-9 text-sm placeholder:text-white/15"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-white/40">Action Link (Optional)</Label>
                <Input 
                  placeholder="e.g. /category/winter" 
                  value={link}
                  onChange={e => setLink(e.target.value)}
                  className="bg-white/[0.03] border-white/[0.06] h-9 text-sm placeholder:text-white/15"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-white/40">Order Index</Label>
                  <Input 
                    type="number"
                    value={orderIndex}
                    onChange={e => setOrderIndex(Number(e.target.value))}
                    className="bg-white/[0.03] border-white/[0.06] h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5 flex flex-col justify-end">
                  <Label className="text-xs font-medium text-white/40 mb-2">Visibility</Label>
                  <div className="flex items-center gap-2 h-9">
                    <Switch 
                      checked={isActive} 
                      onCheckedChange={setIsActive} 
                    />
                    <span className="text-xs text-white/60">{isActive ? 'Active' : 'Hidden'}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-white/[0.04]">
                <Button variant="outline" onClick={closeDialog} className="text-xs h-8 bg-white/[0.03] border-white/[0.06] text-white/50">Cancel</Button>
                <Button 
                  onClick={handleSave} 
                  disabled={saveMutation.isPending}
                  className="text-xs h-8 min-w-[100px] bg-primary text-primary-foreground"
                >
                  {saveMutation.isPending ? <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Saving...</> : 'Save'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {banners.map((banner: any) => (
            <div key={banner.id || banner._id} className="group rounded-xl overflow-hidden bg-[#0A0A0A] border border-white/[0.04] hover:border-white/[0.08] transition-all duration-200">
              <div className="relative aspect-[21/9] bg-white/[0.02]">
                {banner.imageUrl ? (
                  <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-white/10" />
                  </div>
                )}
                
                {/* Status */}
                <div className="absolute top-2 left-2">
                  <span className={`text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-md ${
                    banner.isActive ? 'bg-emerald-500/90 text-white' : 'bg-black/80 text-white/50 border border-white/10'
                  }`}>
                    {banner.isActive ? 'Active' : 'Hidden'}
                  </span>
                </div>
              </div>
              
              <div className="p-4 flex flex-col gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-white/90 line-clamp-1">{banner.title}</h3>
                  {banner.link ? (
                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-white/40">
                      <LinkIcon className="h-3 w-3 shrink-0" />
                      <span className="truncate">{banner.link}</span>
                    </div>
                  ) : (
                    <div className="text-[11px] text-white/20 mt-1">No action link</div>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                  <span className="text-[10px] text-white/30 font-medium bg-white/[0.03] px-2 py-0.5 rounded">
                    Order: {banner.orderIndex || 0}
                  </span>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" className="h-7 w-7 p-0 text-white/50 hover:text-white bg-white/[0.03] hover:bg-white/[0.06]" onClick={() => openEdit(banner)}>
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" className="h-7 w-7 p-0 text-red-400/60 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20" onClick={() => {
                      if (confirm('Delete this banner?')) {
                        deleteMutation.mutate(banner.id || banner._id);
                      }
                    }}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {banners.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-white/[0.05] rounded-xl">
              <ImageIcon className="h-10 w-10 mx-auto mb-3 text-white/10" strokeWidth={1.5} />
              <p className="text-sm font-medium text-white/40">No banners created yet</p>
              <p className="text-[11px] text-white/20 mt-1">Add a banner to showcase campaigns on the app.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
