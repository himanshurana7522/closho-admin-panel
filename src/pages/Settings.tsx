import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Settings as SettingsIcon, User, Users, CreditCard, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export function Settings() {
  const handleSave = () => {
    toast.success('Settings saved successfully!');
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
        
        <TabsContent value="profile" className="mt-0 outline-none">
          <Card className="bg-[#0A0A0A] border border-white/[0.04] rounded-xl shadow-none">
            <CardHeader className="pb-6">
              <CardTitle className="text-lg text-white font-medium">Personal Information</CardTitle>
              <CardDescription className="text-white/50">Update your personal details and contact info.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="h-16 w-16 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/80 font-medium text-xl">
                  SA
                </div>
                <div>
                  <Button variant="outline" size="sm" className="bg-white/[0.03] border-white/[0.06] text-white/60 hover:text-white/80 rounded-lg transition-all duration-200 mb-2">Change Avatar</Button>
                  <p className="text-xs text-white/40">JPG, GIF or PNG. 1MB max.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-xs font-medium text-white/40 uppercase tracking-wider">Full Name</Label>
                  <Input defaultValue="Super Admin" className="bg-white/[0.03] border-white/[0.06] focus-visible:ring-primary/30 focus-visible:border-primary/50 text-white rounded-lg transition-all duration-200" />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-medium text-white/40 uppercase tracking-wider">Email Address</Label>
                  <Input defaultValue="admin@closho.com" disabled className="bg-white/[0.02] border-white/[0.04] text-white/40 cursor-not-allowed rounded-lg" />
                  <p className="text-[11px] text-white/30">Email cannot be changed.</p>
                </div>
              </div>

              <div className="pt-2">
                <Button onClick={handleSave} className="bg-primary text-primary-foreground font-medium text-xs rounded-lg px-5 py-2 transition-all duration-200 hover:opacity-90">Save Profile</Button>
              </div>

              <div className="h-px w-full bg-white/[0.04] my-8" />
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg text-white font-medium mb-1">Change Password</h3>
                  <p className="text-sm text-white/50">Ensure your account is using a long, random password to stay secure.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-xs font-medium text-white/40 uppercase tracking-wider">Current Password</Label>
                    <Input type="password" placeholder="••••••••" className="bg-white/[0.03] border-white/[0.06] focus-visible:ring-primary/30 focus-visible:border-primary/50 text-white rounded-lg transition-all duration-200" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-medium text-white/40 uppercase tracking-wider">New Password</Label>
                    <Input type="password" placeholder="••••••••" className="bg-white/[0.03] border-white/[0.06] focus-visible:ring-primary/30 focus-visible:border-primary/50 text-white rounded-lg transition-all duration-200" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-medium text-white/40 uppercase tracking-wider">Confirm New Password</Label>
                    <Input type="password" placeholder="••••••••" className="bg-white/[0.03] border-white/[0.06] focus-visible:ring-primary/30 focus-visible:border-primary/50 text-white rounded-lg transition-all duration-200" />
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button variant="outline" onClick={handleSave} className="bg-white/[0.03] border-white/[0.06] text-white/60 hover:text-white/80 rounded-lg px-5 py-2 transition-all duration-200">Update Password</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment" className="mt-0 outline-none">
          <Card className="bg-[#0A0A0A] border border-white/[0.04] rounded-xl shadow-none">
            <CardHeader className="pb-6">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg text-white font-medium">Razorpay Integration</CardTitle>
                  <CardDescription className="text-white/50 mt-1">Configure your payment gateway API keys.</CardDescription>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 font-medium text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Connected
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3 max-w-xl">
                <Label className="text-xs font-medium text-white/40 uppercase tracking-wider">Key ID</Label>
                <Input type="text" defaultValue="rzp_live_x1y2z3a4b5c6d7e8" className="font-mono bg-white/[0.03] border-white/[0.06] focus-visible:ring-primary/30 focus-visible:border-primary/50 text-white rounded-lg transition-all duration-200" />
              </div>
              <div className="space-y-3 max-w-xl">
                <Label className="text-xs font-medium text-white/40 uppercase tracking-wider flex justify-between">
                  Key Secret
                  <span className="font-normal text-[10px] text-white/40 hover:text-white/80 cursor-pointer transition-colors">SHOW SECRET</span>
                </Label>
                <Input type="password" defaultValue="xxxxxxxxxxxxxxxxxxxx" className="font-mono bg-white/[0.03] border-white/[0.06] focus-visible:ring-primary/30 focus-visible:border-primary/50 text-white rounded-lg transition-all duration-200" />
              </div>
              <div className="pt-4">
                <Button onClick={handleSave} className="bg-primary text-primary-foreground font-medium text-xs rounded-lg px-5 py-2 transition-all duration-200 hover:opacity-90">Save API Keys</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="team" className="mt-0 outline-none">
          <Card className="bg-[#0A0A0A] border border-white/[0.04] rounded-xl shadow-none">
            <CardHeader className="pb-6 flex flex-row items-center justify-between border-b border-white/[0.04]">
              <div>
                <CardTitle className="text-lg text-white font-medium">Team Members</CardTitle>
                <CardDescription className="text-white/50">Manage who has access to this dashboard.</CardDescription>
              </div>
              <Button size="sm" className="bg-primary text-primary-foreground font-medium text-xs rounded-lg transition-all duration-200 hover:opacity-90">Add Member</Button>
            </CardHeader>
            <CardContent className="pt-12 pb-16 text-center flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-white/[0.02] border border-white/[0.04] flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-white/20" />
              </div>
              <h3 className="text-white font-medium mb-1">No team members yet</h3>
              <p className="text-sm text-white/40">Team management will be available in the next update.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="mt-0 outline-none">
          <Card className="bg-[#0A0A0A] border border-white/[0.04] rounded-xl shadow-none">
            <CardHeader className="pb-6 border-b border-white/[0.04]">
              <CardTitle className="text-lg text-white font-medium">App Configuration</CardTitle>
              <CardDescription className="text-white/50">Global settings for the Closho Customer App.</CardDescription>
            </CardHeader>
            <CardContent className="pt-12 pb-16 text-center flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-white/[0.02] border border-white/[0.04] flex items-center justify-center mb-4">
                <SettingsIcon className="h-6 w-6 text-white/20" />
              </div>
              <h3 className="text-white font-medium mb-1">Coming Soon</h3>
              <p className="text-sm text-white/40">Global app configuration settings will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
