import { Suspense } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { LoadingPage } from "@/components/common/loading";
import { ErrorDisplay } from "@/components/common/error";
import { EmptyState } from "@/components/common/empty-state";
import {
  cn,
  formatRelativeDate,
  getDueDateStatus,
} from "@/lib/utils";
import { getUpcomingAssignments } from "@/lib/canvas";
import { ClipboardList, AlertCircle, Clock, CheckCircle } from "lucide-react";

async function AssignmentsContent() {
  try {
    const assignments = await getUpcomingAssignments();

    if (assignments.length === 0) {
      return (
        <EmptyState
          icon={<ClipboardList className="w-12 h-12" />}
          title="No upcoming assignments"
          description="All caught up! No upcoming assignments found."
        />
      );
    }

    return (
      <div className="space-y-3">
        {assignments.map((assignment) => {
          const status = getDueDateStatus(assignment.due_at);
          return (
            <Link
              key={assignment.id}
              href={`/assignments/${assignment.id}?courseId=${assignment.course_id}`}
            >
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {status === "overdue" ? (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    ) : status === "due-soon" ? (
                      <Clock className="w-5 h-5 text-orange-500" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-900 dark:text-slate-100">
                      {assignment.name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {assignment.course_name ||
                        `Course ${assignment.course_id}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        status === "overdue"
                          ? "text-red-500"
                          : status === "due-soon"
                            ? "text-orange-500"
                            : "text-slate-400"
                      )}
                    >
                      {formatRelativeDate(assignment.due_at)}
                    </span>
                    {assignment.points_possible > 0 && (
                      <p className="text-xs text-slate-400 mt-0.5">
                        {assignment.points_possible} pts
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    );
  } catch (error) {
    return (
      <ErrorDisplay
        title="Could not load assignments"
        message={
          error instanceof Error
            ? error.message
            : "Failed to fetch assignments."
        }
      />
    );
  }
}

export default function AssignmentsPage() {
  return (
    <div>
      <Header
        title="Assignments"
        description="Upcoming and recent assignments across all courses"
      />
      <Suspense fallback={<LoadingPage />}>
        <AssignmentsContent />
      </Suspense>
    </div>
  );
}
