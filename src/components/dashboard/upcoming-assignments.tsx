import Link from "next/link";
import { Clock, AlertCircle, CheckCircle } from "lucide-react";
import { cn, formatRelativeDate, getDueDateStatus } from "@/lib/utils";
import type { CanvasAssignment } from "@/types/canvas";

interface UpcomingAssignmentsProps {
  assignments: CanvasAssignment[];
}

export function UpcomingAssignments({
  assignments,
}: UpcomingAssignmentsProps) {
  if (assignments.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-500" />
          Upcoming Assignments
        </h3>
        <p className="text-sm text-slate-400 py-4 text-center">
          No upcoming assignments!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
        <Clock className="w-5 h-5 text-blue-500" />
        Upcoming Assignments
      </h3>
      <div className="space-y-2">
        {assignments.slice(0, 8).map((assignment) => {
          const status = getDueDateStatus(assignment.due_at);
          return (
            <Link
              key={assignment.id}
              href={`/assignments/${assignment.id}?courseId=${assignment.course_id}`}
              className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <StatusIcon status={status} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                  {assignment.name}
                </p>
                <p className="text-xs text-slate-500">
                  {assignment.course_name || `Course ${assignment.course_id}`}
                </p>
              </div>
              <span
                className={cn(
                  "text-xs font-medium whitespace-nowrap",
                  status === "overdue"
                    ? "text-red-500"
                    : status === "due-soon"
                      ? "text-orange-500"
                      : "text-slate-400"
                )}
              >
                {formatRelativeDate(assignment.due_at)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function StatusIcon({
  status,
}: {
  status: "overdue" | "due-soon" | "upcoming" | "none";
}) {
  switch (status) {
    case "overdue":
      return <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />;
    case "due-soon":
      return <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />;
    default:
      return (
        <CheckCircle className="w-4 h-4 text-slate-300 flex-shrink-0" />
      );
  }
}
