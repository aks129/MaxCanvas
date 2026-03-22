"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { LoadingSpinner } from "@/components/common/loading";
import { ErrorDisplay } from "@/components/common/error";
import { Sparkles, RefreshCw } from "lucide-react";

export default function CatchUpPage() {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchCatchUp() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/catch-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childName: "your child" }),
      });

      if (!response.ok) throw new Error("Failed to get summary");

      const data = await response.json();
      setSummary(data.summary);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate summary"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Header
        title="Parent Catch-Up"
        description="AI-powered summary of your child's school week"
      >
        <button
          onClick={fetchCatchUp}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {summary ? "Refresh Summary" : "Generate Summary"}
        </button>
      </Header>

      {loading && <LoadingSpinner />}

      {error && (
        <ErrorDisplay
          title="Could not generate summary"
          message={error}
          retry={fetchCatchUp}
        />
      )}

      {summary && !loading && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">
              Weekly Summary
            </h2>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-slate-700 dark:text-slate-300">
            {summary}
          </div>
        </div>
      )}

      {!summary && !loading && !error && (
        <div className="text-center py-16">
          <Sparkles className="w-16 h-16 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">
            Ready to catch up?
          </h3>
          <p className="text-sm text-slate-400 dark:text-slate-500 max-w-md mx-auto mb-6">
            Click &quot;Generate Summary&quot; to get an AI-powered overview of your
            child&apos;s recent school activities, grades, and upcoming deadlines.
          </p>
          <button
            onClick={fetchCatchUp}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/25"
          >
            <Sparkles className="w-5 h-5" />
            Generate Weekly Summary
          </button>
        </div>
      )}
    </div>
  );
}
