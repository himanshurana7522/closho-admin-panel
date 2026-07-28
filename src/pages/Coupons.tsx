import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Trash2, Ticket, Percent, Check, CopyIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export function Coupons() {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code ${code} copied!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };
  
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Coupons & Promotions</h2>
          <p className="text-sm text-muted-foreground mt-1">Create and manage discount codes for your customers.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger className="text-xs font-medium h-8 px-3 flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md rounded-md cursor-pointer outline-none">
              <Plus className="h-4 w-4" /> Create Coupon
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <Ticket className="h-5 w-5 text-primary" /> Create New Coupon
              </DialogTitle>
              <DialogDescription>
                Configure a new discount code for your store.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5 pt-2">
              <div className="space-y-2">
                <Label className="font-semibold">Coupon Code *</Label>
                <div className="relative">
                  <Input placeholder="e.g. SUMMER50" className="uppercase font-mono tracking-wider focus-visible:ring-primary pl-10" />
                  <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">Customers will enter this code at checkout.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-semibold">Discount Type</Label>
                  <Select defaultValue="percentage">
                    <SelectTrigger className="focus:ring-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Flat Amount (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold">Value *</Label>
                  <Input type="number" placeholder="50" className="focus-visible:ring-primary" />
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <Label className="font-semibold">Usage Limit</Label>
                <Select defaultValue="unlimited">
                  <SelectTrigger className="focus:ring-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unlimited">Unlimited Uses</SelectItem>
                    <SelectItem value="once_per_user">Once per customer</SelectItem>
                    <SelectItem value="custom">Custom Limit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="mt-6 border-t border-border/50 pt-4">
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button onClick={() => { setIsOpen(false); toast.success('Coupon created successfully!'); }} className="bg-primary text-primary-foreground">Save Coupon</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="search-bar max-w-md flex items-center">
        <div className="relative flex-1 w-full flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-white/20" />
          <Input 
            placeholder="Search coupons..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 border-0 bg-transparent focus-visible:ring-0 shadow-none h-8 text-sm placeholder:text-white/20" 
          />
        </div>
      </div>

      <div className="bg-[#0A0A0A] border border-white/[0.04] rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-white/[0.04] hover:bg-transparent">
              <TableHead className="h-10 px-4 pl-5 text-[11px] font-medium uppercase tracking-wider text-white/25">Code</TableHead>
              <TableHead className="h-10 px-4 text-[11px] font-medium uppercase tracking-wider text-white/25">Discount</TableHead>
              <TableHead className="h-10 px-4 text-[11px] font-medium uppercase tracking-wider text-white/25">Usage</TableHead>
              <TableHead className="h-10 px-4 text-[11px] font-medium uppercase tracking-wider text-white/25">Status</TableHead>
              <TableHead className="h-10 px-4 pr-5 text-right text-[11px] font-medium uppercase tracking-wider text-white/25">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors group">
              <TableCell className="px-4 py-3 pl-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                    <Ticket className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-mono font-bold text-foreground flex items-center gap-2">
                      NEWUSER20
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" 
                        onClick={() => handleCopy('NEWUSER20')}
                      >
                        {copiedCode === 'NEWUSER20' ? <Check className="h-3 w-3 text-green-500" /> : <CopyIcon className="h-3 w-3 text-muted-foreground" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Expires: Dec 31, 2023</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-4 py-3 font-medium text-primary">20% off</TableCell>
              <TableCell className="px-4 py-3">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">45 <span className="text-muted-foreground font-normal">/ 100</span></span>
                  <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-4 py-3"><Badge variant="outline" className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border-none">Active</Badge></TableCell>
              <TableCell className="px-4 py-3 pr-5 text-right">
                <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors group">
              <TableCell className="px-4 py-3 pl-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shrink-0">
                    <Ticket className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div>
                    <div className="font-mono font-bold text-foreground flex items-center gap-2">
                      FLAT500
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" 
                        onClick={() => handleCopy('FLAT500')}
                      >
                        {copiedCode === 'FLAT500' ? <Check className="h-3 w-3 text-green-500" /> : <CopyIcon className="h-3 w-3 text-muted-foreground" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">No expiration</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-4 py-3 font-medium text-indigo-500">₹500 off</TableCell>
              <TableCell className="px-4 py-3">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">120 <span className="text-muted-foreground font-normal">/ ∞</span></span>
                </div>
              </TableCell>
              <TableCell className="px-4 py-3"><Badge variant="outline" className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border-none">Active</Badge></TableCell>
              <TableCell className="px-4 py-3 pr-5 text-right">
                <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors group">
              <TableCell className="px-4 py-3 pl-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center border border-border shrink-0 opacity-50">
                    <Ticket className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="opacity-50">
                    <div className="font-mono font-bold text-foreground">DIWALI10</div>
                    <p className="text-xs text-muted-foreground">Expired: Nov 15, 2023</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-4 py-3 font-medium opacity-50">10% off</TableCell>
              <TableCell className="px-4 py-3 opacity-50">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">85 <span className="text-muted-foreground font-normal">/ 100</span></span>
                </div>
              </TableCell>
              <TableCell className="px-4 py-3"><Badge variant="outline" className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground border-none">Expired</Badge></TableCell>
              <TableCell className="px-4 py-3 pr-5 text-right">
                <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
