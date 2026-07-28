import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Printer, RefreshCcw, Package, CreditCard, CheckCircle2, Clock, Truck, Store } from 'lucide-react';

const orderSteps = [
  { id: 'PENDING', label: 'Order Placed', icon: Clock, date: 'Oct 15, 2023 - 02:30 PM' },
  { id: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle2, date: 'Oct 15, 2023 - 03:45 PM' },
  { id: 'PACKED', label: 'Packed', icon: Package, date: 'Oct 16, 2023 - 10:15 AM' },
  { id: 'SHIPPED', label: 'Shipped', icon: Truck, date: 'Pending' },
  { id: 'DELIVERED', label: 'Delivered', icon: MapPin, date: 'Pending' },
];

export function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Mock current status
  const currentStatusIndex = 2; // PACKED

  const cardClass = "bg-[#0A0A0A] border border-white/[0.04] rounded-xl";
  const headerClass = "p-5 border-b border-white/[0.04] flex flex-col gap-1";
  const titleClass = "text-sm font-semibold text-white/90";

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 z-10 bg-black/40 backdrop-blur-xl py-4 border-b border-white/[0.04] -mx-6 px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/orders')} className="h-8 w-8 shrink-0 text-white/40 hover:text-white hover:bg-white/[0.04]">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold tracking-tight text-white">
                Order {id}
              </h2>
              <Badge variant="outline" className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 border-none">PACKED</Badge>
            </div>
            <p className="text-[11px] text-white/40 flex items-center gap-2 mt-1">
              <span>Oct 15, 2023 at 2:30 PM</span>
              <span className="w-1 h-1 rounded-full bg-white/20"></span>
              <span className="flex items-center gap-1.5"><Store className="h-3 w-3" /> Closho Downtown</span>
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={() => toast.info('Invoice printing started')} className="text-xs font-medium h-8 px-4 flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] text-white/60 hover:text-white/80 hover:bg-white/[0.06]">
            <Printer className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Print Invoice</span>
          </Button>
          <Button onClick={() => toast.success('Order marked as shipped')} className="text-xs font-medium h-8 px-4 flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            Mark as Shipped
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        <div className="lg:col-span-2 space-y-6">
          <div className={`${cardClass} overflow-hidden`}>
            <div className="p-6 border-b border-white/[0.04]">
              <h3 className={`${titleClass} mb-6`}>Order Timeline</h3>
              
              <div className="relative">
                <div className="absolute top-5 left-4 right-4 h-px bg-white/[0.06] -z-10 hidden sm:block"></div>
                <div className="absolute top-5 left-4 h-px bg-primary -z-10 hidden sm:block transition-all duration-500" style={{ width: `${(currentStatusIndex / (orderSteps.length - 1)) * 100}%` }}></div>
                
                <div className="flex flex-col sm:flex-row justify-between gap-6 sm:gap-0">
                  {orderSteps.map((step, index) => {
                    const isCompleted = index <= currentStatusIndex;
                    const isCurrent = index === currentStatusIndex;
                    const StepIcon = step.icon;
                    
                    return (
                      <div key={step.id} className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-3 relative z-10">
                        {/* Mobile line */}
                        {index < orderSteps.length - 1 && (
                          <div className={`absolute left-5 top-10 w-px h-full -z-10 sm:hidden ${isCompleted ? 'bg-primary' : 'bg-white/[0.06]'}`}></div>
                        )}
                        
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                          isCompleted 
                            ? 'bg-primary border-primary text-black' 
                            : 'bg-[#0A0A0A] border-white/[0.08] text-white/20'
                        } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}>
                          <StepIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className={`font-semibold text-xs ${isCompleted ? 'text-white' : 'text-white/40'}`}>
                            {step.label}
                          </p>
                          <p className="text-[10px] text-white/30 mt-0.5">{step.date}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className={`${headerClass} !pb-4`}>
              <h3 className={`${titleClass} flex items-center gap-2`}>
                <Package className="h-4 w-4 text-primary" /> Order Items (2)
              </h3>
            </div>
            <div className="p-0">
              <div className="divide-y divide-white/[0.04]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4 hover:bg-white/[0.015] transition-colors">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="h-16 w-16 rounded-lg bg-white/[0.03] border border-white/[0.04] overflow-hidden shrink-0">
                      <div className="w-full h-full flex items-center justify-center">
                         <Package className="h-6 w-6 text-white/20" strokeWidth={1.5} />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-white/90">Classic Black T-Shirt</h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-medium border border-white/[0.08] bg-white/[0.02] px-1.5 py-0.5 rounded text-white/60">Size: M</span>
                        <span className="text-[10px] text-white/40 font-mono">SKU: TS-BLK-M</span>
                      </div>
                      <p className="text-xs font-medium mt-2 text-white/80">₹999 <span className="text-white/30 font-normal">× 2</span></p>
                    </div>
                  </div>
                  <div className="font-semibold text-sm text-right text-white">
                    ₹1,998
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4 hover:bg-white/[0.015] transition-colors">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="h-16 w-16 rounded-lg bg-white/[0.03] border border-white/[0.04] overflow-hidden shrink-0">
                      <div className="w-full h-full flex items-center justify-center">
                         <Package className="h-6 w-6 text-white/20" strokeWidth={1.5} />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-white/90">Summer Floral Dress</h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-medium border border-white/[0.08] bg-white/[0.02] px-1.5 py-0.5 rounded text-white/60">Size: S</span>
                        <span className="text-[10px] text-white/40 font-mono">SKU: FD-RED-S</span>
                      </div>
                      <p className="text-xs font-medium mt-2 text-white/80">₹1,899 <span className="text-white/30 font-normal">× 1</span></p>
                    </div>
                  </div>
                  <div className="font-semibold text-sm text-right text-white">
                    ₹1,899
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.01] p-5 space-y-2.5 border-t border-white/[0.04]">
                <div className="flex justify-between text-xs">
                  <span className="text-white/50">Subtotal</span>
                  <span className="font-medium text-white/80">₹3,897</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/50">Discount (WELCOME10)</span>
                  <span className="text-green-500 font-medium">-₹100</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/50">Delivery</span>
                  <span className="font-medium text-white/80">₹50</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-white/[0.04] mt-3">
                  <span className="font-semibold text-sm text-white/90">Total Amount</span>
                  <span className="text-lg font-bold text-primary">₹3,847</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className={cardClass}>
            <div className={headerClass}>
              <h3 className={titleClass}>Customer Details</h3>
            </div>
            <div className="p-5 space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm border border-primary/20 shrink-0">
                  RS
                </div>
                <div>
                  <h4 className="font-medium text-sm text-white/90 leading-tight">Rahul Sharma</h4>
                  <p className="text-[10px] text-white/40 mt-0.5">Customer since Jan 2023</p>
                </div>
              </div>
              
              <div className="space-y-2.5 pt-4 border-t border-white/[0.04]">
                <div className="grid grid-cols-[20px_1fr] items-start gap-2 text-xs">
                  <div className="text-white/30 text-[10px]">✉️</div>
                  <div className="font-medium text-white/70">rahul.sharma@example.com</div>
                </div>
                <div className="grid grid-cols-[20px_1fr] items-start gap-2 text-xs">
                  <div className="text-white/30 text-[10px]">📞</div>
                  <div className="font-medium text-white/70">+91 98765 43210</div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.04]">
                <div className="flex items-center gap-1.5 mb-2 font-medium text-xs text-white/80">
                  <MapPin className="h-3.5 w-3.5 text-primary" /> Delivery Address
                </div>
                <div className="text-[11px] text-white/50 leading-relaxed bg-white/[0.02] p-3 rounded-lg border border-white/[0.04]">
                  <span className="font-medium text-white/80 block mb-1">Home</span>
                  A-402, Sunshine Apartments,<br />
                  Lokhandwala Complex, Andheri West,<br />
                  Mumbai, Maharashtra - 400053
                </div>
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <div className={headerClass}>
              <h3 className={titleClass}>Payment Info</h3>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex justify-between items-center text-xs p-2.5 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                <span className="text-white/50">Method</span>
                <span className="flex items-center gap-2 font-medium text-white/80">
                  <div className="bg-white/[0.04] p-1 rounded border border-white/[0.06]">
                    <CreditCard className="h-3.5 w-3.5 text-primary" />
                  </div>
                  UPI (GPay)
                </span>
              </div>
              <div className="flex justify-between items-center text-xs p-2.5 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                <span className="text-white/50">Status</span>
                <Badge variant="outline" className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border-none">PAID</Badge>
              </div>
              <div className="flex flex-col gap-1 p-2.5 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                <span className="text-[10px] text-white/40">Transaction ID</span>
                <span className="font-mono text-xs font-medium text-white/80 tracking-wide">TXN9876543210123</span>
              </div>
            </div>
          </div>

          <div className="bg-red-500/5 border border-red-500/10 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-red-500/10">
              <h3 className="text-sm font-semibold text-red-400 flex items-center gap-2">
                Danger Zone
              </h3>
            </div>
            <div className="p-5 space-y-3">
              <p className="text-[11px] text-red-400/70 mb-3">
                These actions cannot be undone and will notify the customer.
              </p>
              <Button type="button" onClick={() => toast.success('Refund initiated successfully')} className="w-full justify-start h-8 text-xs bg-transparent border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300">
                <RefreshCcw className="mr-2 h-3.5 w-3.5" /> Initiate Refund
              </Button>
              <Button type="button" onClick={() => toast.success('Order cancelled successfully')} className="w-full justify-start h-8 text-xs bg-transparent border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300">
                Cancel Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
