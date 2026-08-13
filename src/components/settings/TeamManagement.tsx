import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Edit, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import api from '@/lib/api';

import React from 'react';

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error: any) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return <div className="p-4 bg-red-500/10 text-red-500 rounded-xl">Crash: {this.state.error?.message || 'Unknown error'}</div>;
    }
    return this.props.children;
  }
}

export function TeamManagement() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('storeAdmin');
  const [storeId, setStoreId] = useState('');

  // Fetch Team
  const { data: team = [], isLoading } = useQuery({
    queryKey: ['admin-team'],
    queryFn: async () => {
      try {
        const res = await api.get('/admin/team');
        if (res?.data?.data && Array.isArray(res.data.data)) return res.data.data;
        if (res?.data && Array.isArray(res.data)) return res.data;
        return [];
      } catch (err) {
        return [];
      }
    }
  });

  // Fetch Stores for dropdown
  const { data: stores = [] } = useQuery({
    queryKey: ['admin-stores-list'],
    queryFn: async () => {
      const res = await api.get('/admin/stores');
      if (res?.data?.data && Array.isArray(res.data.data)) return res.data.data;
      if (res?.data?.stores && Array.isArray(res.data.stores)) return res.data.stores;
      if (res?.data && Array.isArray(res.data)) return res.data;
      return [];
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (editingId) {
        return await api.put(`/admin/team/${editingId}`, payload);
      }
      return await api.post('/admin/team', payload);
    },
    onSuccess: () => {
      toast.success(editingId ? 'Team member updated' : 'Team member added');
      queryClient.invalidateQueries({ queryKey: ['admin-team'] });
      closeDialog();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to save team member');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/admin/team/${id}`);
    },
    onSuccess: () => {
      toast.success('Team member removed');
      queryClient.invalidateQueries({ queryKey: ['admin-team'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to remove team member');
    }
  });

  const handleSave = () => {
    if (!fullName || (!editingId && (!email || !password))) {
      toast.error('Please fill required fields');
      return;
    }
    const payload: any = { fullName, phone_no: phone, role, storeId: storeId || undefined };
    if (!editingId) {
      payload.email = email;
      payload.password = password;
    }
    saveMutation.mutate(payload);
  };

  const openEdit = (member: any) => {
    setEditingId(member.id || member._id);
    setFullName(String(member.fullName || ''));
    setEmail(String(member.email || ''));
    setPhone(String(member.phone_no || member.phone || ''));
    setPassword('');
    setRole(String(member.role || 'storeAdmin'));
    setStoreId(String(member.storeId || ''));
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setTimeout(() => {
      setEditingId(null);
      setFullName('');
      setEmail('');
      setPhone('');
      setPassword('');
      setRole('storeAdmin');
      setStoreId('');
    }, 300);
  };

  return (
    <ErrorBoundary>
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-white">Team Members</h3>
          <p className="text-xs text-white/40 mt-1">Manage who has access to your admin panel and stores.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger className="text-xs font-medium h-8 px-3 inline-flex items-center justify-center rounded-md text-primary-foreground bg-primary hover:bg-primary/90 outline-none cursor-pointer" onClick={() => {
              setEditingId(null);
              setFullName(''); setEmail(''); setPhone(''); setPassword(''); setRole('storeAdmin'); setStoreId('');
            }}>
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Member
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px] bg-[#0A0A0A] border-white/[0.06]">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-white">{editingId ? 'Edit Member' : 'Add Team Member'}</DialogTitle>
              <DialogDescription className="text-xs text-white/40">
                {editingId ? 'Update team member details.' : 'Invite a new member to manage your stores.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-white/40">Full Name *</Label>
                <Input value={fullName} onChange={e => setFullName(e.target.value)} className="bg-white/[0.03] border-white/[0.06] h-9 text-sm" />
              </div>
              {!editingId && (
                <>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-white/40">Email *</Label>
                    <Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-white/[0.03] border-white/[0.06] h-9 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-white/40">Password *</Label>
                    <Input type="password" value={password} onChange={e => setPassword(e.target.value)} className="bg-white/[0.03] border-white/[0.06] h-9 text-sm" />
                  </div>
                </>
              )}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-white/40">Phone Number</Label>
                <Input value={phone} onChange={e => setPhone(e.target.value)} className="bg-white/[0.03] border-white/[0.06] h-9 text-sm" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-white/40">Role</Label>
                  <Select value={role} onValueChange={(val) => setRole(val || 'storeAdmin')}>
                    <SelectTrigger className="bg-white/[0.03] border-white/[0.06] h-9 text-sm">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0A0A0A] border-white/[0.06]">
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="storeAdmin">Store Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-white/40">Assigned Store</Label>
                  <Select value={storeId || 'global'} onValueChange={(val) => setStoreId(val === 'global' ? '' : val)}>
                    <SelectTrigger className="bg-white/[0.03] border-white/[0.06] h-9 text-sm">
                      <SelectValue placeholder="Select store" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0A0A0A] border-white/[0.06]">
                      <SelectItem value="global">All Stores (Global)</SelectItem>
                      {stores.map((s: any) => (
                        <SelectItem key={s.id || s._id} value={s.id || s._id}>{String(s.name)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-white/[0.04]">
                <Button variant="outline" onClick={closeDialog} className="text-xs h-8 bg-white/[0.03] border-white/[0.06] text-white/50">Cancel</Button>
                <Button onClick={handleSave} disabled={saveMutation.isPending} className="text-xs h-8 min-w-[100px] bg-primary text-primary-foreground">
                  {saveMutation.isPending ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : 'Save'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-[#0A0A0A] border border-white/[0.04] rounded-xl overflow-hidden mt-4">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-white/[0.04] hover:bg-transparent">
              <TableHead className="h-10 px-4 text-[11px] font-medium uppercase tracking-wider text-white/25">Name</TableHead>
              <TableHead className="h-10 px-4 text-[11px] font-medium uppercase tracking-wider text-white/25">Role</TableHead>
              <TableHead className="h-10 px-4 text-[11px] font-medium uppercase tracking-wider text-white/25">Store</TableHead>
              <TableHead className="h-10 px-4 text-right text-[11px] font-medium uppercase tracking-wider text-white/25">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <Loader2 className="h-5 w-5 animate-spin text-primary mx-auto" />
                </TableCell>
              </TableRow>
            ) : team.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-xs text-white/40">No team members found.</TableCell>
              </TableRow>
            ) : (
              team.map((member: any) => (
                <TableRow key={member.id || member._id} className="border-b border-white/[0.03] hover:bg-white/[0.015]">
                  <TableCell className="px-4 py-3">
                    <div className="font-medium text-sm text-white/90">{String(member.fullName || '')}</div>
                    <div className="text-xs text-white/40">{String(member.email || '')}</div>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <span className="text-[10px] uppercase tracking-wider bg-white/[0.03] px-2 py-0.5 rounded text-white/60">
                      {String(member.role || 'ADMIN')}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-xs text-white/50">
                    {String(stores.find((s:any) => (s.id || s._id) === member.storeId)?.name || 'Global (All Stores)')}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1 opacity-60 hover:opacity-100 transition-opacity">
                      <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-white/[0.06]" onClick={() => openEdit(member)}>
                        <Edit className="h-3.5 w-3.5 text-white/50" />
                      </Button>
                      <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-red-500/10" onClick={() => {
                        if (confirm('Delete this team member?')) deleteMutation.mutate(member.id || member._id);
                      }}>
                        <Trash2 className="h-3.5 w-3.5 text-red-400/60" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
    </ErrorBoundary>
  );
}
