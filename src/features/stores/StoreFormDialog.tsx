import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const storeSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  pincode: z.string().min(6, 'Valid pincode required'),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  radius: z.coerce.number().min(1, 'Minimum 1km radius'),
  contact: z.string().min(10, 'Valid contact number required'),
});

type StoreFormValues = z.infer<typeof storeSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Partial<StoreFormValues>;
}

export function StoreFormDialog({ open, onOpenChange, defaultValues }: Props) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: defaultValues || {
      radius: 5,
    },
  });

  const onSubmit = async (data: StoreFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success(`Store "${data.name}" has been ${defaultValues ? 'updated' : 'created'} successfully.`);
    onOpenChange(false);
    if (!defaultValues) reset();
  };

  const inputClass = "bg-white/[0.03] border-white/[0.06] h-9 text-sm placeholder:text-white/15 focus-visible:ring-primary/30 focus-visible:border-primary/40";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] bg-[#0A0A0A] border-white/[0.06]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-white">
            {defaultValues ? 'Edit Store' : 'Add New Store'}
          </DialogTitle>
          <DialogDescription className="text-xs text-white/30">
            Enter the details for the physical store location.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <Label htmlFor="name" className="text-xs font-medium text-white/40">Store Name</Label>
              <Input id="name" {...register('name')} placeholder="e.g. Closho Bandra" className={inputClass} />
              {errors.name && <p className="text-[11px] text-red-400/80">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <Label htmlFor="contact" className="text-xs font-medium text-white/40">Contact Number</Label>
              <Input id="contact" {...register('contact')} placeholder="+91..." className={inputClass} />
              {errors.contact && <p className="text-[11px] text-red-400/80">{errors.contact.message}</p>}
            </div>
            
            <div className="space-y-1.5 col-span-2">
              <Label htmlFor="address" className="text-xs font-medium text-white/40">Address</Label>
              <Input id="address" {...register('address')} placeholder="123 Street Name, Near Landmark..." className={inputClass} />
              {errors.address && <p className="text-[11px] text-red-400/80">{errors.address.message}</p>}
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="city" className="text-xs font-medium text-white/40">City</Label>
              <Input id="city" {...register('city')} placeholder="Mumbai" className={inputClass} />
              {errors.city && <p className="text-[11px] text-red-400/80">{errors.city.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pincode" className="text-xs font-medium text-white/40">Pincode</Label>
              <Input id="pincode" {...register('pincode')} placeholder="400001" className={inputClass} />
              {errors.pincode && <p className="text-[11px] text-red-400/80">{errors.pincode.message}</p>}
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="latitude" className="text-xs font-medium text-white/30">Latitude <span className="text-white/15">(optional)</span></Label>
              <Input id="latitude" {...register('latitude')} placeholder="19.0760" className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="longitude" className="text-xs font-medium text-white/30">Longitude <span className="text-white/15">(optional)</span></Label>
              <Input id="longitude" {...register('longitude')} placeholder="72.8777" className={inputClass} />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="radius" className="text-xs font-medium text-white/40">Delivery Radius (km)</Label>
              <Input id="radius" type="number" {...register('radius')} min={1} className={inputClass} />
              {errors.radius && <p className="text-[11px] text-red-400/80">{errors.radius.message}</p>}
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-3 border-t border-white/[0.04]">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="text-xs h-8 bg-white/[0.03] border-white/[0.06] text-white/50">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="text-xs h-8 min-w-[100px]">
              {isSubmitting ? (
                <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> Saving...</>
              ) : (
                defaultValues ? 'Update Store' : 'Save Store'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
