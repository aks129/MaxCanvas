import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { LoadingPage } from "@/components/common/loading";
import { ErrorDisplay } from "@/components/common/error";
import { EmptyState } from "@/components/common/empty-state";
import {
  cn,
  formatRelativeDate,
  formatDateTime,
  getDueDateStatus,
  getGradeBadgeColor,
} from "@/lib/utils";
import {
  getUpcomingAssignments,
  getGradesForAllCourses,
  getAnnouncements,
} from "@/lib/canvas";
import {
  Sun,
  CheckCircle,
  AlertTriangle,
  Clock,
  Star,
  ArrowRight,
  Zap,
} from "lucide-react";
import Link from "next/link";

async function TodayContent() {
  try {
    const [assignments, grades, announcements] = await Promise.all([
      getUpcomingAssignments(),
      getGradesForAllCourses(),
      getAnnouncements(),
    ]);

    // Split assignments by urgency
    const overdue = assignments.filter(
      (a) => getDueDateStatus(a.due_at) === "overdue"
    );
    const dueToday = assignments.filter(
      (a) => getDueDateStatus(a.due_at) === "due-soon"
    );
    const upcoming = assignments
      .filter((a) => getDueDateStatus(a.due_at) === "upcoming")
      .slice(0, 5);

    // Find courses needing attention (below 80%)
    const needsWork = grades.filter(
      (g) => g.current_score !== null && g.current_score < 80
    );

    // Count new announcements (last 2 days)
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const recentAnnouncements = announcements.filter(
      (a) => new Date(a.posted_at) > twoDaysAgo
    );

    const hasNothing =
      overdue.length === 0 &&
      dueToday.length === 0 &&
      upcoming.length === 0;

    return (
      <div className="max-w-3xl space-y-6">
        {/* Quick Status Banner */}
        <div
          className={cn(
            "rounded-xl p-5 border",
            overdue.length > 0
              ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
              : dueToday.length > 0
                ? "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800"
                : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
          )}
        >
          <div className="flex items-center gap-3">
            {overdue.length > 0 ? (
              <AlertTriangle className="w-8 h-8 text-red-500" />
            ) : dueToday.length > 0 ? (
              <Clock className="w-8 h-8 text-orange-500" />
            ) : (
              <Star className="w-8 h-8 text-green-500" />
            )}
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {overdue.length > 0
                  ? `${overdue.length} assignment${overdue.length > 1 ? "s" : ""} overdue!`
                  : dueToday.length > 0
                    ? `${dueToday.length} due very soon`
                    : "You're all caught up!"}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {overdue.length > 0
                  ? "Let's tackle the overdue work first."
                  : dueToday.length > 0
                    ? "Focus on these before they're late."
                    : "Great job! Check upcoming work to stay ahead."}
              </p>
            </div>
          </div>
        </div>

        {/* OVERDUE - Priority 1 */}
        {overdue.length > 0 && (
          <section>
            <h3 className="text-sm font-bold text-red-600 uppercase tracking-wider mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Overdue — Do These First
            </h3>
            <div className="space-y-2">
              {overdue.map((a) => (
                <Link
                  key={a.id}
                  href={`/assignments/${a.id}?courseId=${a.course_id}`}
                >
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 hover:shadow-md transition-all flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {a.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {a.course_name || `Course ${a.course_id}`} &middot;{" "}
                        {a.points_possible} pts
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-red-600">
                        {formatRelativeDate(a.due_at)}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-red-400" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* DUE SOON - Priority 2 */}
        {dueToday.length > 0 && (
          <section>
            <h3 className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Due Very Soon
            </h3>
            <div className="space-y-2">
              {dueToday.map((a) => (
                <Link
                  key={a.id}
                  href={`/assignments/${a.id}?courseId=${a.course_id}`}
                >
                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 hover:shadow-md transition-all flex items-center gap-3">
                    <Clock className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {a.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {a.course_name || `Course ${a.course_id}`} &middot;{" "}
                        {a.points_possible} pts
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-orange-600">
                        {formatDateTime(a.due_at)}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-orange-400" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* UPCOMING - Priority 3 */}
        {upcoming.length > 0 && (
          <section>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Coming Up Next
            </h3>
            <div className="space-y-2">
              {upcoming.map((a) => (
                <Link
                  key={a.id}
                  href={`/assignments/${a.id}?courseId=${a.course_id}`}
                >
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-all flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-slate-300 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {a.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {a.course_name || `Course ${a.course_id}`}
                      </p>
                    </div>
                    <span className="text-sm text-slate-400">
                      {formatRelativeDate(a.due_at)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Courses Needing Attention */}
        {needsWork.length > 0 && (
          <section>
            <h3 className="text-sm font-bold text-yellow-600 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Courses to Focus On
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {needsWork.map((g) => (
                <Link key={g.course_id} href={`/grades/${g.course_id}`}>
                  <div className="bg-white dark:bg-slate-800 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 hover:shadow-md transition-all">
                    <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                      {g.course_name}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span
                        className={cn(
                          "text-lg font-bold",
                          getGradeBadgeColor(g.current_score)
                        )}
                      >
                        {g.current_score}%
                      </span>
                      <span className="text-xs text-slate-400">
                        {g.current_grade || ""}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* New Announcements */}
        {recentAnnouncements.length > 0 && (
          <section>
            <h3 className="text-sm font-bold text-blue-500 uppercase tracking-wider mb-3">
              New from Teachers ({recentAnnouncements.length})
            </h3>
            <div className="space-y-2">
              {recentAnnouncements.slice(0, 3).map((a) => (
                <div
                  key={a.id}
                  className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3"
                >
                  <p className="font-medium text-sm text-slate-900 dark:text-slate-100">
                    {a.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {a.author?.display_name}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {hasNothing && (
          <EmptyState
            icon={<Star className="w-12 h-12" />}
            title="Nothing due today!"
            description="You're all caught up. Check the calendar for what's coming next week."
          />
        )}
      </div>
    );
  } catch (error) {
    return (
      <ErrorDisplay
        title="Could not load today's view"
        message={
          error instanceof Error
            ? error.message
            : "Failed to connect to Canvas."
        }
      />
    );
  }
}

export default function TodayPage() {
  return (
    <div>
      <Header
        title="Today"
        description="What needs your attention right now"
      />
      <Suspense fallback={<LoadingPage />}>
        <TodayContent />
      </Suspense>
    </div>
  );
}
