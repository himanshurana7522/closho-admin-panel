import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, UploadCloud, Plus, Trash2, CheckCircle2, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

const productSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  brand: z.string().optional(),
  basePrice: z.coerce.number().min(0, 'Price must be positive'),
  discountedPrice: z.coerce.number().optional(),
  material: z.string().optional(),
  careInstructions: z.string().optional(),
  gender: z.string().optional(),
  isActive: z.boolean(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export function ProductCreate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const [dragActive, setDragActive] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [colors, setColors] = useState<string[]>(['Black', 'White']);
  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      isActive: true,
      basePrice: 0,
    }
  });

  useEffect(() => {
    if (isEditing && id) {
      reset({
        name: 'Classic Black T-Shirt',
        description: 'High quality premium t-shirt with modern fit.',
        category: 'Men / Topwear',
        brand: 'Closho',
        basePrice: 999,
        discountedPrice: 799,
        material: '100% Cotton',
        careInstructions: 'Machine wash cold',
        gender: 'Men',
        isActive: true,
      });
      setImages(['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&q=80']);
      setSizes(['S', 'M', 'L']);
      setColors(['Black']);
    }
  }, [isEditing, id, reset]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      toast.success("Images uploaded successfully!");
      setImages([...images, URL.createObjectURL(e.dataTransfer.files[0])]);
    }
  };

  const addSize = () => {
    if (newSize && !sizes.includes(newSize)) {
      setSizes([...sizes, newSize]);
      setNewSize('');
    }
  };

  const addColor = () => {
    if (newColor && !colors.includes(newColor)) {
      setColors([...colors, newColor]);
      setNewColor('');
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    console.log(data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success(`Product ${isEditing ? 'updated' : 'created'} successfully!`);
    navigate('/products');
  };

  const inputClass = "bg-white/[0.03] border-white/[0.06] h-9 text-sm placeholder:text-white/15 focus-visible:ring-primary/30 focus-visible:border-primary/40";
  const labelClass = "text-xs font-medium text-white/40 uppercase tracking-wider";
  const cardClass = "bg-[#0A0A0A] border border-white/[0.04] rounded-xl";
  const headerClass = "p-5 border-b border-white/[0.04] flex flex-col gap-1";
  const titleClass = "text-sm font-semibold text-white/90";
  const descClass = "text-[11px] text-white/30";

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 z-10 bg-black/40 backdrop-blur-xl py-4 border-b border-white/[0.04] -mx-6 px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/products')} className="h-8 w-8 shrink-0 text-white/40 hover:text-white hover:bg-white/[0.04]">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-white">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-xs text-muted-foreground hidden sm:block mt-0.5">
              {isEditing ? `Editing product ${id}` : 'Create a new product in your catalog.'}
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={() => navigate('/products')} className="text-xs font-medium h-8 px-4 bg-white/[0.03] border border-white/[0.06] text-white/60 hover:text-white/80 hover:bg-white/[0.06]">
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="text-xs font-medium h-8 px-4 min-w-[120px] bg-primary text-primary-foreground hover:bg-primary/90">
            {isSubmitting ? (
              <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> Saving...</>
            ) : (
              <><CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Save Product</>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className={cardClass}>
            <div className={headerClass}>
              <h3 className={titleClass}>Basic Information</h3>
              <p className={descClass}>Essential details about your product.</p>
            </div>
            <div className="p-5 space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="name" className={labelClass}>Product Name *</Label>
                <Input id="name" {...register('name')} placeholder="e.g. Classic Black T-Shirt" className={inputClass} />
                {errors.name && <p className="text-[11px] text-red-400/80">{errors.name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description" className={labelClass}>Description *</Label>
                <Textarea 
                  id="description" 
                  {...register('description')} 
                  placeholder="Enter detailed product description..." 
                  className="min-h-[120px] bg-white/[0.03] border-white/[0.06] text-sm placeholder:text-white/15 focus-visible:ring-primary/30 focus-visible:border-primary/40 resize-y"
                />
                {errors.description && <p className="text-[11px] text-red-400/80">{errors.description.message}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="category" className={labelClass}>Category *</Label>
                  <Input id="category" {...register('category')} placeholder="e.g. Men / T-Shirts" className={inputClass} />
                  {errors.category && <p className="text-[11px] text-red-400/80">{errors.category.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="brand" className={labelClass}>Brand</Label>
                  <Input id="brand" {...register('brand')} placeholder="e.g. Closho" className={inputClass} />
                </div>
              </div>
            </div>
          </div>

          {/* Media */}
          <div className={cardClass}>
            <div className={headerClass}>
              <h3 className={titleClass}>Media Gallery</h3>
              <p className={descClass}>Upload high quality images (min 800x800px).</p>
            </div>
            <div className="p-5">
              <div 
                className={`border border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                  dragActive ? 'border-primary/60 bg-primary/5' : 'border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.02]'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="h-12 w-12 rounded-full bg-white/[0.04] flex items-center justify-center mb-3">
                  <UploadCloud className="h-5 w-5 text-white/20" />
                </div>
                <h3 className="font-medium text-sm text-white/60">Drag & drop images here</h3>
                <p className="text-[11px] text-white/20 mt-1 mb-4 max-w-sm">
                  Support for JPG, PNG, WEBP. Max file size 5MB.
                </p>
                <div className="flex items-center gap-2">
                  <Button type="button" className="text-xs h-8 px-4 bg-white/[0.03] border border-white/[0.06] text-white/60 pointer-events-none">Select Files</Button>
                </div>
              </div>
              
              {images.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mt-5">
                  {images.map((img, i) => (
                     <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-white/[0.04]">
                      <img src={img} alt="Product preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button size="icon" className="h-7 w-7 bg-red-500/20 text-red-400 hover:bg-red-500/40 hover:text-red-300" onClick={() => setImages(images.filter((_, idx) => idx !== i))}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Variants */}
          <div className={cardClass}>
            <div className={headerClass}>
              <h3 className={titleClass}>Variant Matrix</h3>
              <p className={descClass}>Configure sizes, colors, and specific inventory.</p>
            </div>
            <div className="p-0">
              <Tabs defaultValue="matrix" className="w-full">
                <div className="px-5 pt-3 border-b border-white/[0.04]">
                  <TabsList className="mb-3 bg-white/[0.02] border border-white/[0.04] p-1 rounded-lg">
                    <TabsTrigger value="matrix" className="text-[11px] h-7 px-3 data-[state=active]:bg-white/[0.04] data-[state=active]:text-white text-white/40">Matrix View</TabsTrigger>
                    <TabsTrigger value="sizes" className="text-[11px] h-7 px-3 data-[state=active]:bg-white/[0.04] data-[state=active]:text-white text-white/40">Manage Sizes</TabsTrigger>
                    <TabsTrigger value="colors" className="text-[11px] h-7 px-3 data-[state=active]:bg-white/[0.04] data-[state=active]:text-white text-white/40">Manage Colors</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="matrix" className="p-0 m-0">
                  {sizes.length > 0 && colors.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead className="border-b border-white/[0.04]">
                          <tr>
                            <th className="h-10 px-5 text-[11px] font-medium uppercase tracking-wider text-white/25">Variant</th>
                            <th className="h-10 px-5 text-[11px] font-medium uppercase tracking-wider text-white/25">Price</th>
                            <th className="h-10 px-5 text-[11px] font-medium uppercase tracking-wider text-white/25">Stock</th>
                            <th className="h-10 px-5 text-[11px] font-medium uppercase tracking-wider text-white/25">SKU</th>
                          </tr>
                        </thead>
                        <tbody>
                          {colors.map(color => (
                            sizes.map(size => (
                              <tr key={`${color}-${size}`} className="border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors">
                                <td className="px-5 py-3">
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.06] px-2 py-1 rounded-md">
                                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color.toLowerCase() === 'white' ? '#fff' : color.toLowerCase() === 'black' ? '#222' : color }}></div>
                                      <span className="font-medium text-[11px] text-white/70">{color}</span>
                                    </div>
                                    <span className="text-white/20 text-xs">/</span>
                                    <span className="font-medium text-[11px] text-white/70 border border-white/[0.06] px-2 py-1 rounded-md bg-white/[0.03]">{size}</span>
                                  </div>
                                </td>
                                <td className="px-5 py-3">
                                  <Input className="h-8 w-24 bg-white/[0.03] border-white/[0.06] text-xs placeholder:text-white/20" placeholder="0.00" type="number" />
                                </td>
                                <td className="px-5 py-3">
                                  <Input className="h-8 w-20 bg-white/[0.03] border-white/[0.06] text-xs placeholder:text-white/20" placeholder="0" type="number" />
                                </td>
                                <td className="px-5 py-3">
                                  <Input className="h-8 w-32 bg-white/[0.03] border-white/[0.06] text-xs placeholder:text-white/20" placeholder={`SKU-${color.substring(0,3).toUpperCase()}-${size}`} />
                                </td>
                              </tr>
                            ))
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-10 flex flex-col items-center">
                      <ImageIcon className="h-8 w-8 text-white/10 mb-3" strokeWidth={1.5} />
                      <p className="text-[11px] text-white/30">Add at least one size and color to generate the matrix.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="sizes" className="p-5 m-0 space-y-4">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Add size (e.g. XL, 42)" 
                      className="max-w-[200px] bg-white/[0.03] border-white/[0.06] h-8 text-xs" 
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                    />
                    <Button type="button" className="h-8 text-xs px-3 bg-white/[0.03] border border-white/[0.06] text-white/60 hover:text-white/90" onClick={addSize}><Plus className="h-3.5 w-3.5 mr-1.5" /> Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {sizes.map(size => (
                      <div key={size} className="group flex items-center gap-2 bg-white/[0.03] px-2.5 py-1.5 rounded-md border border-white/[0.06]">
                        <span className="text-[11px] font-medium text-white/70">{size}</span>
                        <Trash2 
                          className="h-3 w-3 text-white/20 cursor-pointer group-hover:text-red-400 transition-colors" 
                          onClick={() => setSizes(sizes.filter(s => s !== size))}
                        />
                      </div>
                    ))}
                    {sizes.length === 0 && <p className="text-[11px] text-white/30">No sizes added.</p>}
                  </div>
                </TabsContent>

                <TabsContent value="colors" className="p-5 m-0 space-y-4">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Add color (e.g. Red, Blue)" 
                      className="max-w-[200px] bg-white/[0.03] border-white/[0.06] h-8 text-xs" 
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                    />
                    <Button type="button" className="h-8 text-xs px-3 bg-white/[0.03] border border-white/[0.06] text-white/60 hover:text-white/90" onClick={addColor}><Plus className="h-3.5 w-3.5 mr-1.5" /> Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {colors.map(color => (
                      <div key={color} className="group flex items-center gap-2 bg-white/[0.03] px-2.5 py-1.5 rounded-md border border-white/[0.06]">
                        <div className="w-2 h-2 rounded-full border border-white/[0.1]" style={{ backgroundColor: color.toLowerCase() === 'white' ? '#fff' : color.toLowerCase() === 'black' ? '#222' : color }}></div>
                        <span className="text-[11px] font-medium text-white/70">{color}</span>
                        <Trash2 
                          className="h-3 w-3 text-white/20 cursor-pointer group-hover:text-red-400 transition-colors" 
                          onClick={() => setColors(colors.filter(c => c !== color))}
                        />
                      </div>
                    ))}
                    {colors.length === 0 && <p className="text-[11px] text-white/30">No colors added.</p>}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className={cardClass}>
            <div className={headerClass}>
              <h3 className={titleClass}>Pricing Strategy</h3>
            </div>
            <div className="p-5 space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="basePrice" className={labelClass}>Base Price (₹) *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-white/30 text-sm">₹</span>
                  <Input id="basePrice" type="number" {...register('basePrice')} className={`${inputClass} pl-7`} />
                </div>
                {errors.basePrice && <p className="text-[11px] text-red-400/80">{errors.basePrice.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="discountedPrice" className={`${labelClass} flex justify-between`}>
                  <span>Discounted Price (₹)</span>
                  <span className="text-[10px] font-normal normal-case text-white/25 tracking-normal">Optional</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-white/30 text-sm">₹</span>
                  <Input id="discountedPrice" type="number" {...register('discountedPrice')} className={`${inputClass} pl-7`} />
                </div>
                <p className="text-[10px] text-white/30">Set if product is on sale.</p>
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <div className={headerClass}>
              <h3 className={titleClass}>Attributes</h3>
            </div>
            <div className="p-5 space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="material" className={labelClass}>Material</Label>
                <Input id="material" {...register('material')} placeholder="e.g. 100% Cotton" className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="careInstructions" className={labelClass}>Care Instructions</Label>
                <Input id="careInstructions" {...register('careInstructions')} placeholder="e.g. Machine wash cold" className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="gender" className={labelClass}>Gender Focus</Label>
                <Input id="gender" {...register('gender')} placeholder="e.g. Men, Women, Unisex" className={inputClass} />
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <div className={headerClass}>
              <h3 className={titleClass}>Visibility Options</h3>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between p-3.5 rounded-lg border border-white/[0.04] bg-white/[0.01]">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium text-white/80">Active Status</Label>
                  <p className="text-[11px] text-white/30">Toggle visibility on customer app</p>
                </div>
                <Switch defaultChecked={true} className="data-[state=checked]:bg-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
