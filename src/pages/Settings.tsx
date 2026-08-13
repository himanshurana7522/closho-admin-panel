import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { User, Users, CreditCard, ShieldCheck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth.store';
import { TeamManagement } from '@/components/settings/TeamManagement';

export function Settings() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // Fetch Settings
  const { data: payments = {}, isLoading: isPaymentsLoading } = useQuery({
    queryKey: ['admin-settings-payments'],
    queryFn: async () => {
      const res = await api.get('/admin/settings/payments');
      return res.data.data || {};
    }
  });

  const { data: config = {}, isLoading: isConfigLoading } = useQuery({
    queryKey: ['admin-settings-config'],
    queryFn: async () => {
      const res = await api.get('/admin/settings/config');
      return res.data.data || {};
    }
  });

  // Local state for Payments
  const [payState, setPayState] = useState<any>({});
  useEffect(() => {
    if (Object.keys(payments).length > 0) {
      setPayState(payments);
    }
  }, [payments]);

  // Local state for Config
  const [configState, setConfigState] = useState<any>({});
  useEffect(() => {
    if (Object.keys(config).length > 0) {
      setConfigState(config);
    }
  }, [config]);

  // Mutations
  const payMutation = useMutation({
    mutationFn: async (payload: any) => api.put('/admin/settings/payments', payload),
    onSuccess: () => {
      toast.success('Payment settings updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-settings-payments'] });
    },
    onError: () => toast.error('Failed to update payment settings')
  });

  const configMutation = useMutation({
    mutationFn: async (payload: any) => api.put('/admin/settings/config', payload),
    onSuccess: () => {
      toast.success('App configuration updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-settings-config'] });
    },
    onError: () => toast.error('Failed to update configuration')
  });

  const isLoading = isPaymentsLoading || isConfigLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-white">Settings</h2>
        <p className="text-white/50 mt-1 text-sm">Manage your profile, team access, and platform configuration.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full space-y-6">
        <TabsList className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-1 inline-flex w-full sm:w-auto h-auto">
          <TabsTrigger value="profile" className="text-xs font-medium text-white/30 hover:text-white/50 data-[state=active]:text-white data-[state=active]:bg-white/[0.04] rounded-lg px-3 py-1.5 flex items-center gap-2 transition-all duration-200">
            <User className="h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="team" className="text-xs font-medium text-white/30 hover:text-white/50 data-[state=active]:text-white data-[state=active]:bg-white/[0.04] rounded-lg px-3 py-1.5 flex items-center gap-2 transition-all duration-200">
            <Users className="h-4 w-4" /> Team
          </TabsTrigger>
          <TabsTrigger value="payment" className="text-xs font-medium text-white/30 hover:text-white/50 data-[state=active]:text-white data-[state=active]:bg-white/[0.04] rounded-lg px-3 py-1.5 flex items-center gap-2 transition-all duration-200">
            <CreditCard className="h-4 w-4" /> Payments
          </TabsTrigger>
          <TabsTrigger value="config" className="text-xs font-medium text-white/30 hover:text-white/50 data-[state=active]:text-white data-[state=active]:bg-white/[0.04] rounded-lg px-3 py-1.5 flex items-center gap-2 transition-all duration-200">
            <ShieldCheck className="h-4 w-4" /> App Config
          </TabsTrigger>
        </TabsList>
        
        {/* PROFILE TAB */}
        <TabsContent value="profile" className="mt-0 outline-none">
          <Card className="bg-[#0A0A0A] border border-white/[0.04] rounded-xl shadow-none">
            <CardHeader className="pb-6">
              <CardTitle className="text-lg text-white font-medium">Personal Information</CardTitle>
              <CardDescription className="text-white/50">Update your personal details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="h-16 w-16 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/80 font-medium text-xl">
                  {user?.fullName?.substring(0, 2).toUpperCase() || 'AD'}
                </div>
                <div>
                  <Button variant="outline" size="sm" className="bg-white/[0.03] border-white/[0.06] text-white/60 hover:text-white/80 rounded-lg transition-all duration-200 mb-2">Change Avatar</Button>
                  <p className="text-xs text-white/40">JPG, GIF or PNG. 1MB max.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-xs font-medium text-white/40 uppercase tracking-wider">Full Name</Label>
                  <Input defaultValue={user?.fullName || 'Admin User'} readOnly className="bg-white/[0.03] border-white/[0.06] focus-visible:ring-primary/30 focus-visible:border-primary/50 text-white rounded-lg transition-all duration-200" />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-medium text-white/40 uppercase tracking-wider">Email Address</Label>
                  <Input defaultValue={user?.email || 'admin@example.com'} readOnly className="bg-white/[0.03] border-white/[0.06] focus-visible:ring-primary/30 focus-visible:border-primary/50 text-white rounded-lg transition-all duration-200" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TEAM TAB */}
        <TabsContent value="team" className="mt-0 outline-none">
          <TeamManagement />
        </TabsContent>

        {/* PAYMENTS TAB */}
        <TabsContent value="payment" className="mt-0 outline-none">
          <Card className="bg-[#0A0A0A] border border-white/[0.04] rounded-xl shadow-none">
            <CardHeader className="pb-6">
              <CardTitle className="text-lg text-white font-medium">Payment Gateways</CardTitle>
              <CardDescription className="text-white/50">Configure payment providers and COD rules.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-xs font-medium text-white/40 uppercase tracking-wider">Razorpay Key ID</Label>
                  <Input 
                    value={payState.razorpayKeyId || ''} 
                    onChange={e => setPayState({...payState, razorpayKeyId: e.target.value})}
                    placeholder="rzp_test_..."
                    className="bg-white/[0.03] border-white/[0.06] text-white rounded-lg" 
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-medium text-white/40 uppercase tracking-wider">Razorpay Enabled</Label>
                  <div className="flex items-center h-10">
                    <Switch checked={payState.razorpayEnabled || false} onCheckedChange={c => setPayState({...payState, razorpayEnabled: c})} />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-xs font-medium text-white/40 uppercase tracking-wider">COD Enabled</Label>
                  <div className="flex items-center h-10">
                    <Switch checked={payState.codEnabled || false} onCheckedChange={c => setPayState({...payState, codEnabled: c})} />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-medium text-white/40 uppercase tracking-wider">UPI Enabled</Label>
                  <div className="flex items-center h-10">
                    <Switch checked={payState.upiEnabled || false} onCheckedChange={c => setPayState({...payState, upiEnabled: c})} />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-medium text-white/40 uppercase tracking-wider">Min Order for COD (₹)</Label>
                  <Input 
                    type="number"
                    value={payState.minOrderForCod || 0} 
                    onChange={e => setPayState({...payState, minOrderForCod: Number(e.target.value)})}
                    className="bg-white/[0.03] border-white/[0.06] text-white rounded-lg" 
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-medium text-white/40 uppercase tracking-wider">Max Order for COD (₹)</Label>
                  <Input 
                    type="number"
                    value={payState.maxOrderForCod || 0} 
                    onChange={e => setPayState({...payState, maxOrderForCod: Number(e.target.value)})}
                    className="bg-white/[0.03] border-white/[0.06] text-white rounded-lg" 
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.04] flex justify-end">
                <Button 
                  onClick={() => payMutation.mutate(payState)} 
                  disabled={payMutation.isPending}
                  className="bg-primary text-primary-foreground text-xs font-medium"
                >
                  {payMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Save Payment Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* APP CONFIG TAB */}
        <TabsContent value="config" className="mt-0 outline-none">
          <Card className="bg-[#0A0A0A] border border-white/[0.04] rounded-xl shadow-none">
            <CardHeader className="pb-6">
              <CardTitle className="text-lg text-white font-medium">Application Configuration</CardTitle>
              <CardDescription className="text-white/50">Manage global app behavior like delivery fees and taxes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-xs font-medium text-white/40 uppercase tracking-wider">Tax Percentage (%)</Label>
                  <Input 
                    type="number"
                    value={configState.taxPercentage || 0} 
                    onChange={e => setConfigState({...configState, taxPercentage: Number(e.target.value)})}
                    className="bg-white/[0.03] border-white/[0.06] text-white rounded-lg" 
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-medium text-white/40 uppercase tracking-wider">Default Currency</Label>
                  <Input 
                    value={configState.defaultCurrency || ''} 
                    onChange={e => setConfigState({...configState, defaultCurrency: e.target.value})}
                    placeholder="e.g. INR"
                    className="bg-white/[0.03] border-white/[0.06] text-white rounded-lg uppercase" 
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-medium text-white/40 uppercase tracking-wider">Delivery Charges (₹)</Label>
                  <Input 
                    type="number"
                    value={configState.deliveryCharges || 0} 
                    onChange={e => setConfigState({...configState, deliveryCharges: Number(e.target.value)})}
                    className="bg-white/[0.03] border-white/[0.06] text-white rounded-lg" 
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-medium text-white/40 uppercase tracking-wider">Free Delivery Above (₹)</Label>
                  <Input 
                    type="number"
                    value={configState.freeDeliveryAbove || 0} 
                    onChange={e => setConfigState({...configState, freeDeliveryAbove: Number(e.target.value)})}
                    className="bg-white/[0.03] border-white/[0.06] text-white rounded-lg" 
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-medium text-white/40 uppercase tracking-wider">Allow User Registration</Label>
                  <div className="flex items-center h-10">
                    <Switch checked={configState.allowRegistration || false} onCheckedChange={c => setConfigState({...configState, allowRegistration: c})} />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-medium text-white/40 uppercase tracking-wider">Require Email Verification</Label>
                  <div className="flex items-center h-10">
                    <Switch checked={configState.requireEmailVerification || false} onCheckedChange={c => setConfigState({...configState, requireEmailVerification: c})} />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-xs font-medium text-white/40 uppercase tracking-wider">Maintenance Mode</Label>
                  <div className="flex items-center h-10">
                    <Switch checked={configState.maintenanceMode || false} onCheckedChange={c => setConfigState({...configState, maintenanceMode: c})} />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.04] flex justify-end">
                <Button 
                  onClick={() => configMutation.mutate(configState)} 
                  disabled={configMutation.isPending}
                  className="bg-primary text-primary-foreground text-xs font-medium"
                >
                  {configMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Save Configuration
                </Button>
              </div>

            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
