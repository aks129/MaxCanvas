import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function Header({
  title,
  description,
  children,
  className,
}: HeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-700",
        className
      )}
    >
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {description}
          </p>
        )}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}
