import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Plus, MoreHorizontal, Edit, Trash2, FolderTree, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import api from '@/lib/api';

export function Categories() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isApiMissing, setIsApiMissing] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState<string | null>(null);
  
  // Fetch Categories
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      try {
        const res = await api.get('/admin/categories');
        setIsApiMissing(false);
        if (res?.data?.data && Array.isArray(res.data.data)) return res.data.data;
        if (res?.data?.categories && Array.isArray(res.data.categories)) return res.data.categories;
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
        return await api.put(`/admin/categories/${editingId}`, payload);
      }
      return await api.post('/admin/categories', payload);
    },
    onSuccess: () => {
      toast.success(editingId ? 'Category updated successfully!' : 'Category created successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      closeDialog();
    },
    onError: (err: any) => {
      console.error('Save category error:', err);
      toast.error(err.response?.data?.message || 'Failed to save category');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/admin/categories/${id}`);
    },
    onSuccess: () => {
      toast.success('Category deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete category');
    }
  });

  const filteredCategories = categories.filter((c: any) => 
    (c.name || '').toLowerCase().includes(search.toLowerCase()) || 
    (c.description || '').toLowerCase().includes(search.toLowerCase())
  );

  const generateSlug = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }
    const payload: any = {
      name,
      slug: generateSlug(name),
      description,
    };
    if (parentId && parentId !== 'none') {
      payload.parentId = parentId;
    }
    saveMutation.mutate(payload);
  };

  const openEdit = (cat: any) => {
    setEditingId(cat.id || cat._id);
    setName(cat.name || '');
    setDescription(cat.description || '');
    setParentId(cat.parentId || cat.parent?.id || cat.parent || null);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setTimeout(() => {
      setEditingId(null);
      setName('');
      setDescription('');
      setParentId(null);
    }, 300);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-8">
      {isApiMissing && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-red-500">Backend Missing</h3>
            <p className="text-xs text-red-400/90 mt-1">The Categories API (/admin/categories) is returning 404. Categories cannot be saved or fetched.</p>
          </div>
        </div>
      )}

      <div className="page-header">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Categories</h2>
          <p className="text-sm text-muted-foreground mt-1">Organize your products into collections and groups.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger className="text-xs font-medium h-8 px-3 inline-flex items-center justify-center rounded-md text-primary-foreground bg-primary hover:bg-primary/90 outline-none cursor-pointer" onClick={() => {
              setEditingId(null);
              setName('');
              setDescription('');
              setParentId(null);
            }}>
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Category
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-[#0A0A0A] border-white/[0.06]">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-white">{editingId ? 'Edit Category' : 'Create Category'}</DialogTitle>
              <DialogDescription className="text-xs text-white/40">
                Categories help customers browse your products more easily.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-white/40">Name *</Label>
                <Input 
                  placeholder="e.g. Men's Clothing" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="bg-white/[0.03] border-white/[0.06] h-9 text-sm placeholder:text-white/15 focus-visible:ring-primary/30"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-white/40">Slug</Label>
                <Input 
                  value={generateSlug(name)}
                  disabled
                  className="bg-white/[0.01] border-white/[0.04] h-9 text-sm text-white/30"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-white/40">Parent Category (Optional)</Label>
                <Select value={parentId || 'none'} onValueChange={setParentId}>
                  <SelectTrigger className="bg-white/[0.03] border-white/[0.06] h-9 text-sm text-white">
                    <SelectValue placeholder="Select Parent" />
                  </SelectTrigger>
                  <SelectContent className="border-white/[0.06]">
                    <SelectItem value="none">None (Top Level Category)</SelectItem>
                    {categories.filter((c: any) => c.id !== editingId && c._id !== editingId).map((c: any) => (
                      <SelectItem key={c.id || c._id} value={c.id || c._id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-white/40">Description</Label>
                <Textarea 
                  placeholder="A short description of this category..." 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="resize-none bg-white/[0.03] border-white/[0.06] h-20 text-sm placeholder:text-white/15 focus-visible:ring-primary/30"
                />
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

      <div className="search-bar max-w-md">
        <Search className="h-4 w-4 text-white/20 shrink-0" />
        <input 
          placeholder="Search categories..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-0 outline-none text-sm text-white/80 placeholder:text-white/20 w-full"
        />
      </div>

      <div className="bg-[#0A0A0A] border border-white/[0.04] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="border-b border-white/[0.04]">
              <tr>
                <th className="h-10 pl-5 pr-4 text-[11px] font-medium uppercase tracking-wider text-white/25">Name</th>
                <th className="h-10 px-4 text-[11px] font-medium uppercase tracking-wider text-white/25">Slug</th>
                <th className="h-10 px-4 text-[11px] font-medium uppercase tracking-wider text-white/25">Description</th>
                <th className="h-10 pr-5 pl-4 text-right text-[11px] font-medium uppercase tracking-wider text-white/25">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-white/20 mx-auto" />
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center">
                    <FolderTree className="h-8 w-8 text-white/10 mx-auto mb-3" />
                    <p className="text-xs text-white/30">No categories found</p>
                  </td>
                </tr>
              ) : (
                (() => {
                  // Build Tree
                  const topLevel = filteredCategories.filter((c: any) => !c.parentId && !c.parent);
                  const getChildren = (parentId: string) => filteredCategories.filter((c: any) => 
                    c.parentId === parentId || (c.parent && (c.parent.id === parentId || c.parent._id === parentId))
                  );

                  const renderRow = (cat: any, depth: number) => {
                    const children = getChildren(cat.id || cat._id);
                    return (
                      <React.Fragment key={cat.id || cat._id}>
                        <tr className="border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors group">
                          <td className="pr-4 py-3" style={{ paddingLeft: `${20 + (depth * 24)}px` }}>
                            <div className="flex items-center gap-2">
                              {depth > 0 && <div className="w-px h-6 bg-white/[0.1] -ml-4 mr-2" />}
                              <div>
                                <div className="text-sm font-medium text-white/90">{cat.name}</div>
                                {depth > 0 && (
                                  <div className="text-[10px] text-white/40 mt-0.5 flex items-center">
                                    <FolderTree className="h-3 w-3 mr-1 opacity-50" />
                                    Sub-Category
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-xs text-white/40 font-mono bg-white/[0.02] inline-block px-1.5 py-0.5 rounded">{cat.slug}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-xs text-white/50 line-clamp-1 max-w-xs">{cat.description || '-'}</div>
                          </td>
                          <td className="pr-5 pl-4 py-3 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center justify-center rounded-md hover:bg-white/[0.04] outline-none">
                                <MoreHorizontal className="h-4 w-4 text-white/40" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-[#0A0A0A] border-white/[0.06] w-36">
                                <DropdownMenuItem onClick={() => openEdit(cat)} className="text-xs text-white/70 focus:text-white focus:bg-white/[0.04] cursor-pointer">
                                  <Edit className="mr-2 h-3.5 w-3.5" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => {
                                    if (confirm('Are you sure you want to delete this category?')) {
                                      deleteMutation.mutate(cat.id || cat._id);
                                    }
                                  }}
                                  className="text-xs text-red-400 focus:text-red-300 focus:bg-red-500/10 cursor-pointer"
                                >
                                  <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                        {children.map((child: any) => renderRow(child, depth + 1))}
                      </React.Fragment>
                    );
                  };

                  return topLevel.map((cat: any) => renderRow(cat, 0));
                })()
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
