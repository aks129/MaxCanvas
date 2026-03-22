import { cn } from "@/lib/utils";

export function LoadingCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6",
        className
      )}
    >
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4" />
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mb-2" />
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="space-y-4">
      <div className="animate-pulse h-8 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
      </div>
    </div>
  );
}

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );
}
