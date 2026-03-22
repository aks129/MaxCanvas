import { Suspense } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { LoadingPage } from "@/components/common/loading";
import { ErrorDisplay } from "@/components/common/error";
import { EmptyState } from "@/components/common/empty-state";
import { cn, getGradeBadgeColor } from "@/lib/utils";
import { getGradesForAllCourses } from "@/lib/canvas";
import { GraduationCap, ChevronRight } from "lucide-react";

async function GradesContent() {
  try {
    const grades = await getGradesForAllCourses();

    if (grades.length === 0) {
      return (
        <EmptyState
          title="No courses found"
          description="No active course enrollments found in Canvas."
        />
      );
    }

    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Course
              </th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Current Grade
              </th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Score
              </th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Final
              </th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {grades.map((grade) => (
              <tr
                key={grade.course_id}
                className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <Link
                    href={`/grades/${grade.course_id}`}
                    className="flex items-center gap-3 group"
                  >
                    <GraduationCap className="w-5 h-5 text-blue-500" />
                    <span className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-blue-600">
                      {grade.course_name}
                    </span>
                  </Link>
                </td>
                <td className="px-6 py-4 text-center">
                  {grade.current_grade ? (
                    <span
                      className={cn(
                        "text-sm font-bold px-3 py-1 rounded-full",
                        getGradeBadgeColor(grade.current_score)
                      )}
                    >
                      {grade.current_grade}
                    </span>
                  ) : (
                    <span className="text-sm text-slate-400">—</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {grade.current_score !== null
                      ? `${grade.current_score}%`
                      : "—"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm text-slate-500">
                    {grade.final_score !== null
                      ? `${grade.final_score}%`
                      : "—"}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <Link href={`/grades/${grade.course_id}`}>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } catch (error) {
    return (
      <ErrorDisplay
        title="Could not load grades"
        message={
          error instanceof Error
            ? error.message
            : "Failed to fetch grades from Canvas."
        }
      />
    );
  }
}

export default function GradesPage() {
  return (
    <div>
      <Header title="Grades" description="All course grades at a glance" />
      <Suspense fallback={<LoadingPage />}>
        <GradesContent />
      </Suspense>
    </div>
  );
}
