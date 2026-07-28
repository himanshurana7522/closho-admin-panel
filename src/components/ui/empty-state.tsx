import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center min-h-[300px] rounded-xl bg-white/[0.01] border border-dashed border-white/[0.06]">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/[0.03] mb-5">
        <Icon className="h-6 w-6 text-white/15" strokeWidth={1.5} />
      </div>
      <h3 className="text-sm font-medium text-white/60">{title}</h3>
      <p className="text-xs text-white/25 mt-1.5 max-w-xs mx-auto mb-5 leading-relaxed">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
