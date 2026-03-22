"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorDisplayProps {
  title?: string;
  message: string;
  retry?: () => void;
}

export function ErrorDisplay({
  title = "Something went wrong",
  message,
  retry,
}: ErrorDisplayProps) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
      <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
      <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
        {title}
      </h3>
      <p className="text-sm text-red-600 dark:text-red-300 mt-1">{message}</p>
      {retry && (
        <button
          onClick={retry}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
}
