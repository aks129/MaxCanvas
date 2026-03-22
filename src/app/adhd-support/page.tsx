import { Suspense } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { LoadingPage } from "@/components/common/loading";
import { ErrorDisplay } from "@/components/common/error";
import {
  cn,
  formatRelativeDate,
  getDueDateStatus,
  getGradeBadgeColor,
} from "@/lib/utils";
import {
  getUpcomingAssignments,
  getGradesForAllCourses,
} from "@/lib/canvas";
import {
  Brain,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingDown,
  Lightbulb,
  Heart,
  Calendar,
  Zap,
  ArrowRight,
} from "lucide-react";

async function ADHDContent() {
  try {
    const [assignments, grades] = await Promise.all([
      getUpcomingAssignments(),
      getGradesForAllCourses(),
    ]);

    const overdue = assignments.filter(
      (a) => getDueDateStatus(a.due_at) === "overdue"
    );
    const dueSoon = assignments.filter(
      (a) => getDueDateStatus(a.due_at) === "due-soon"
    );
    const upcoming = assignments.filter(
      (a) => getDueDateStatus(a.due_at) === "upcoming"
    );

    const lowGrades = grades.filter(
      (g) => g.current_score !== null && g.current_score < 75
    );
    const goodGrades = grades.filter(
      (g) => g.current_score !== null && g.current_score >= 85
    );

    return (
      <div className="max-w-4xl space-y-8">
        {/* Executive Function Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Urgency Meter */}
          <div
            className={cn(
              "rounded-xl p-5 border-2 text-center",
              overdue.length > 0
                ? "border-red-300 bg-red-50 dark:bg-red-900/20"
                : dueSoon.length > 0
                  ? "border-orange-300 bg-orange-50 dark:bg-orange-900/20"
                  : "border-green-300 bg-green-50 dark:bg-green-900/20"
            )}
          >
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Urgency
            </p>
            <p className="text-4xl font-bold">
              {overdue.length > 0 ? (
                <span className="text-red-600">{overdue.length}</span>
              ) : dueSoon.length > 0 ? (
                <span className="text-orange-600">{dueSoon.length}</span>
              ) : (
                <span className="text-green-600">0</span>
              )}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {overdue.length > 0
                ? "overdue assignments"
                : dueSoon.length > 0
                  ? "due very soon"
                  : "nothing urgent"}
            </p>
          </div>

          {/* Total Upcoming */}
          <div className="rounded-xl p-5 border-2 border-blue-200 bg-blue-50 dark:bg-blue-900/20 text-center">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">
              This Week
            </p>
            <p className="text-4xl font-bold text-blue-600">
              {assignments.length}
            </p>
            <p className="text-xs text-slate-500 mt-1">total assignments</p>
          </div>

          {/* Celebration */}
          <div className="rounded-xl p-5 border-2 border-purple-200 bg-purple-50 dark:bg-purple-900/20 text-center">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Doing Great In
            </p>
            <p className="text-4xl font-bold text-purple-600">
              {goodGrades.length}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              course{goodGrades.length !== 1 ? "s" : ""} above 85%
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/focus">
              <div className="bg-blue-600 text-white rounded-xl p-5 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 flex items-center gap-3">
                <Target className="w-8 h-8" />
                <div>
                  <p className="font-bold">Start Focus Mode</p>
                  <p className="text-sm text-blue-200">
                    One task, one timer, zero distractions
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 ml-auto" />
              </div>
            </Link>
            <Link href="/today">
              <div className="bg-green-600 text-white rounded-xl p-5 hover:bg-green-700 transition-all shadow-lg shadow-green-500/25 flex items-center gap-3">
                <Calendar className="w-8 h-8" />
                <div>
                  <p className="font-bold">Today&apos;s View</p>
                  <p className="text-sm text-green-200">
                    Just what needs attention today
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 ml-auto" />
              </div>
            </Link>
          </div>
        </section>

        {/* Priority Queue — What to do and in what order */}
        {(overdue.length > 0 || dueSoon.length > 0) && (
          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-500" />
              Priority Queue — Do These In Order
            </h2>
            <div className="space-y-2">
              {[...overdue, ...dueSoon].map((a, i) => {
                const isOverdue = getDueDateStatus(a.due_at) === "overdue";
                return (
                  <Link
                    key={a.id}
                    href={`/assignments/${a.id}?courseId=${a.course_id}`}
                  >
                    <div
                      className={cn(
                        "rounded-lg p-4 border flex items-center gap-4 hover:shadow-md transition-all",
                        isOverdue
                          ? "border-red-200 bg-red-50 dark:bg-red-900/20"
                          : "border-orange-200 bg-orange-50 dark:bg-orange-900/20"
                      )}
                    >
                      <span className="text-2xl font-bold text-slate-300 w-8">
                        {i + 1}
                      </span>
                      {isOverdue ? (
                        <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      ) : (
                        <Clock className="w-5 h-5 text-orange-500 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {a.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {a.course_name || `Course ${a.course_id}`} &middot;{" "}
                          {a.points_possible} pts
                        </p>
                      </div>
                      <span
                        className={cn(
                          "text-sm font-bold",
                          isOverdue ? "text-red-600" : "text-orange-600"
                        )}
                      >
                        {formatRelativeDate(a.due_at)}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Courses Needing Help */}
        {lowGrades.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-yellow-500" />
              Areas for Improvement
            </h2>
            <div className="space-y-2">
              {lowGrades.map((g) => (
                <Link key={g.course_id} href={`/grades/${g.course_id}`}>
                  <div className="bg-white dark:bg-slate-800 rounded-lg border border-yellow-200 dark:border-yellow-800 p-4 flex items-center gap-4 hover:shadow-md transition-all">
                    <span
                      className={cn(
                        "text-xl font-bold px-3 py-1 rounded-lg",
                        getGradeBadgeColor(g.current_score)
                      )}
                    >
                      {g.current_score}%
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {g.course_name}
                      </p>
                      <p className="text-xs text-slate-500">
                        Look for missing or low-scoring assignments to
                        redo
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Wins & Celebrations */}
        {goodGrades.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500" />
              Celebrate These Wins!
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {goodGrades.map((g) => (
                <div
                  key={g.course_id}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 p-4 flex items-center gap-3"
                >
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {g.course_name}
                    </p>
                    <p className="text-sm font-bold text-green-600">
                      {g.current_score}% — Great work!
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ADHD Strategies Panel */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-5">
            <h3 className="font-bold text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2">
              <Brain className="w-5 h-5" />
              For Parents
            </h3>
            <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  Check the Priority Queue with your child each evening
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  Use Focus Mode together — sit nearby while they work
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  Celebrate the wins column — positive reinforcement matters
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  Share the AI Catch-Up summary with teachers at conferences
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800 p-5">
            <h3 className="font-bold text-purple-800 dark:text-purple-200 mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              For Teachers
            </h3>
            <ul className="space-y-2 text-sm text-purple-700 dark:text-purple-300">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  Break large assignments into Canvas sub-assignments
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  Post reminders 48 hours before due dates via announcements
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  Use rubrics — they help ADHD students understand expectations
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  Leave specific, actionable feedback in submission comments
                </span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    return (
      <ErrorDisplay
        title="Could not load ADHD support view"
        message={
          error instanceof Error
            ? error.message
            : "Failed to connect to Canvas."
        }
      />
    );
  }
}

export default function ADHDSupportPage() {
  return (
    <div>
      <Header
        title="ADHD Support"
        description="Tools and strategies for managing assignments with ADHD"
      />
      <Suspense fallback={<LoadingPage />}>
        <ADHDContent />
      </Suspense>
    </div>
  );
}
