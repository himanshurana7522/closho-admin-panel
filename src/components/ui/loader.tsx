import { Loader2 } from 'lucide-react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  fullScreen?: boolean;
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
};

export function Loader({ size = 'md', text, fullScreen = false }: LoaderProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={`animate-spin text-primary ${sizeMap[size]}`} />
      {text && <p className="text-sm text-muted-foreground font-medium animate-pulse">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return <div className="flex w-full items-center justify-center p-8">{content}</div>;
}
