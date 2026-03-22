import { Suspense } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { LoadingPage } from "@/components/common/loading";
import { ErrorDisplay } from "@/components/common/error";
import { EmptyState } from "@/components/common/empty-state";
import { getCourse, getModules } from "@/lib/canvas";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Circle,
} from "lucide-react";

interface Props {
  params: Promise<{ courseId: string }>;
}

async function ModulesContent({ courseId }: { courseId: number }) {
  try {
    const [course, modules] = await Promise.all([
      getCourse(courseId),
      getModules(courseId),
    ]);

    if (modules.length === 0) {
      return (
        <EmptyState
          icon={<BookOpen className="w-12 h-12" />}
          title="No modules"
          description="No modules found for this course."
        />
      );
    }

    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {course.name}
        </h2>
        {modules.map((module) => (
          <div
            key={module.id}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"
          >
            <div className="flex items-center gap-3">
              {module.state === "completed" ? (
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-slate-300 flex-shrink-0" />
              )}
              <div className="flex-1">
                <h3 className="font-medium text-slate-900 dark:text-slate-100">
                  {module.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {module.items_count} items
                  {module.completed_at && (
                    <> &middot; Completed</>
                  )}
                </p>
              </div>
              <span className="text-xs text-slate-400 capitalize">
                {module.state}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    return (
      <ErrorDisplay
        title="Could not load modules"
        message={
          error instanceof Error
            ? error.message
            : "Failed to fetch modules."
        }
      />
    );
  }
}

export default async function ModulesPage({ params }: Props) {
  const { courseId } = await params;
  return (
    <div>
      <Link
        href="/grades"
        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Courses
      </Link>
      <Header title="Modules" description="Course module progress" />
      <Suspense fallback={<LoadingPage />}>
        <ModulesContent courseId={parseInt(courseId)} />
      </Suspense>
    </div>
  );
}
