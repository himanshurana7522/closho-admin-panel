import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Play, Heart, Eye, MoreVertical, UploadCloud, Film, Video } from 'lucide-react';
import { toast } from 'sonner';

const MOCK_REELS = [
  { id: '1', caption: 'Summer Collection 2024 is here! ✨', thumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=200&h=350', views: 12500, likes: 3420, status: 'PUBLISHED', products: 2 },
  { id: '2', caption: 'How to style our vintage denim jacket 🧥', thumbnail: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=200&h=350', views: 8900, likes: 1205, status: 'PUBLISHED', products: 1 },
  { id: '3', caption: 'Behind the scenes at our new store launch', thumbnail: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=200&h=350', views: 0, likes: 0, status: 'DRAFT', products: 0 },
  { id: '4', caption: 'Festive season offers starting soon 🎉', thumbnail: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=200&h=350', views: 0, likes: 0, status: 'SCHEDULED', products: 4 },
];

export function Reels() {
  const [search, setSearch] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredReels = MOCK_REELS.filter(r => r.caption.toLowerCase().includes(search.toLowerCase()));

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const simulateUpload = () => {
    if (!file) return;
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          toast.success('Reel uploaded successfully!');
          setIsUploading(false);
          setIsUploadOpen(false);
          setFile(null);
          setUploadProgress(0);
        }, 500);
      }
      setUploadProgress(Math.min(progress, 100));
    }, 200);
  };

  const resetUpload = (open: boolean) => {
    setIsUploadOpen(open);
    if (!open) {
      setTimeout(() => {
        setFile(null);
        setUploadProgress(0);
        setIsUploading(false);
      }, 300);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-8">
      <div className="page-header">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Reels</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage video content and shoppable reels for the customer app.</p>
        </div>
        
        <Dialog open={isUploadOpen} onOpenChange={resetUpload}>
          <DialogTrigger className="text-xs font-medium h-8 px-3 inline-flex items-center justify-center rounded-md text-primary-foreground bg-primary hover:bg-primary/90 outline-none cursor-pointer">
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Upload Reel
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-[#0A0A0A] border-white/[0.06]">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-white">Upload New Reel</DialogTitle>
              <DialogDescription className="text-xs text-white/30">Add a new vertical video to your store's feed.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-3">
              {!file ? (
                <div 
                  className={`border border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    isDragging ? 'border-primary/60 bg-primary/5' : 'border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.02]'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="video/mp4,video/webm" 
                    onChange={handleFileChange}
                  />
                  <div className="h-12 w-12 rounded-full bg-white/[0.04] flex items-center justify-center mb-3">
                    <UploadCloud className="h-5 w-5 text-white/20" />
                  </div>
                  <p className="text-sm font-medium text-white/60">Click to upload or drag & drop</p>
                  <p className="text-[11px] text-white/20 mt-1">
                    Vertical video (9:16). MP4 or WebM (Max 50MB)
                  </p>
                </div>
              ) : (
                <div className="border border-white/[0.06] rounded-xl p-3 bg-white/[0.02] relative overflow-hidden">
                  {isUploading && (
                    <div 
                      className="absolute inset-y-0 left-0 bg-primary/10 transition-all duration-200 ease-out" 
                      style={{ width: `${uploadProgress}%` }}
                    />
                  )}
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="h-10 w-10 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                      <Video className="h-5 w-5 text-white/30" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white/70 truncate">{file.name}</p>
                      <p className="text-[10px] text-white/25 mt-0.5">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    {!isUploading && (
                      <Button variant="ghost" size="sm" onClick={() => setFile(null)} className="text-red-400/60 hover:text-red-400 text-[11px] h-7">
                        Remove
                      </Button>
                    )}
                    {isUploading && (
                      <div className="text-xs font-medium text-primary">{Math.round(uploadProgress)}%</div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-white/40">Caption</Label>
                <Textarea placeholder="Write a catchy caption..." className="resize-none bg-white/[0.03] border-white/[0.06] h-20 text-sm placeholder:text-white/15" disabled={isUploading} />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-white/40">Tag Products</Label>
                  <Input placeholder="Search products..." className="bg-white/[0.03] border-white/[0.06] h-8 text-xs placeholder:text-white/15" disabled={isUploading} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-white/40">Status</Label>
                  <Select defaultValue="PUBLISHED" disabled={isUploading}>
                    <SelectTrigger className="bg-white/[0.03] border-white/[0.06] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0A0A0A] border-white/[0.06]">
                      <SelectItem value="PUBLISHED">Publish Now</SelectItem>
                      <SelectItem value="SCHEDULED">Schedule</SelectItem>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-3 border-t border-white/[0.04]">
                <Button variant="outline" onClick={() => resetUpload(false)} disabled={isUploading} className="text-xs h-8 bg-white/[0.03] border-white/[0.06] text-white/50">Cancel</Button>
                <Button 
                  onClick={simulateUpload} 
                  disabled={!file || isUploading}
                  className="text-xs h-8 min-w-[100px]"
                >
                  {isUploading ? 'Uploading...' : 'Save Reel'}
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
          placeholder="Search reels..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-0 outline-none text-sm text-white/80 placeholder:text-white/20 w-full"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {filteredReels.map((reel) => (
          <div key={reel.id} className="group rounded-xl overflow-hidden bg-[#0A0A0A] border border-white/[0.04] hover:border-white/[0.08] transition-all duration-200">
            <div className="relative aspect-[9/16] bg-black">
              <img src={reel.thumbnail} alt="Thumbnail" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300 group-hover:scale-[1.02]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transform scale-75 group-hover:scale-100 transition-all duration-300">
                  <Play className="h-4 w-4 text-white ml-0.5" />
                </div>
              </div>
              
              {/* Status badge */}
              <div className="absolute top-2 left-2">
                <span className={`text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-md ${
                  reel.status === 'PUBLISHED' ? 'bg-primary/90 text-black' : 
                  reel.status === 'DRAFT' ? 'bg-white/80 text-black' : 
                  'bg-black/60 text-white/80 border border-white/20'
                }`}>
                  {reel.status}
                </span>
              </div>

              {/* More button */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="h-7 w-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white">
                  <MoreVertical className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Product count */}
              {reel.products > 0 && (
                <div className="absolute bottom-2 right-2">
                  <span className="bg-black/60 backdrop-blur-md text-[9px] font-bold text-white/80 px-1.5 py-0.5 rounded-full border border-white/10">
                    🛍️ {reel.products}
                  </span>
                </div>
              )}
            </div>
            
            <div className="p-3 space-y-2">
              <p className="text-[11px] font-medium text-white/60 line-clamp-2 leading-relaxed group-hover:text-white/80 transition-colors">
                {reel.caption}
              </p>
              
              <div className="flex items-center gap-3 text-[10px] text-white/25">
                <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {reel.views > 1000 ? `${(reel.views/1000).toFixed(1)}k` : reel.views}</span>
                <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {reel.likes > 1000 ? `${(reel.likes/1000).toFixed(1)}k` : reel.likes}</span>
              </div>
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
    </div>
  );
}
