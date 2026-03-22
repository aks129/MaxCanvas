import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 text-center",
        className
      )}
    >
      <div className="text-slate-300 dark:text-slate-600 mb-4">
        {icon || <Inbox className="w-12 h-12" />}
      </div>
      <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 max-w-md">
          {description}
        </p>
      )}
    </div>
  );
}
