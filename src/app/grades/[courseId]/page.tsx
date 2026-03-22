import { Suspense } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { LoadingPage } from "@/components/common/loading";
import { ErrorDisplay } from "@/components/common/error";
import { EmptyState } from "@/components/common/empty-state";
import { cn, formatDate, getGradeBadgeColor } from "@/lib/utils";
import { getCourse, getAssignments, getSubmissions } from "@/lib/canvas";
import { ArrowLeft, AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface Props {
  params: Promise<{ courseId: string }>;
}

async function CourseGradesContent({ courseId }: { courseId: number }) {
  try {
    const [course, assignments, submissions] = await Promise.all([
      getCourse(courseId),
      getAssignments(courseId),
      getSubmissions(courseId),
    ]);

    const submissionMap = new Map(
      submissions.map((s) => [s.assignment_id, s])
    );

    const graded = assignments
      .filter((a) => a.points_possible > 0)
      .map((a) => ({
        ...a,
        submission: submissionMap.get(a.id),
      }))
      .sort((a, b) => {
        const dateA = a.due_at ? new Date(a.due_at).getTime() : Infinity;
        const dateB = b.due_at ? new Date(b.due_at).getTime() : Infinity;
        return dateB - dateA;
      });

    if (graded.length === 0) {
      return (
        <EmptyState
          title="No graded assignments"
          description="No assignments with point values found for this course."
        />
      );
    }

    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">
            {course.name}
          </h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Assignment
              </th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Score
              </th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Due Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {graded.map((assignment) => {
              const sub = assignment.submission;
              const score = sub?.score;
              const pct =
                score !== null && score !== undefined
                  ? Math.round((score / assignment.points_possible) * 100)
                  : null;

              return (
                <tr
                  key={assignment.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/30"
                >
                  <td className="px-6 py-3">
                    <Link
                      href={`/assignments/${assignment.id}?courseId=${assignment.course_id}`}
                      className="text-sm font-medium text-slate-900 dark:text-slate-100 hover:text-blue-600"
                    >
                      {assignment.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <SubmissionStatus submission={sub} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    {score !== null && score !== undefined ? (
                      <span
                        className={cn(
                          "text-sm font-bold px-2 py-0.5 rounded",
                          getGradeBadgeColor(pct)
                        )}
                      >
                        {score}/{assignment.points_possible}
                      </span>
                    ) : (
                      <span className="text-sm text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-right text-sm text-slate-500">
                    {formatDate(assignment.due_at)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  } catch (error) {
    return (
      <ErrorDisplay
        title="Could not load course grades"
        message={
          error instanceof Error
            ? error.message
            : "Failed to fetch course data."
        }
      />
    );
  }
}

function SubmissionStatus({
  submission,
}: {
  submission?: { missing: boolean; late: boolean; excused: boolean; submitted_at: string | null };
}) {
  if (!submission) return <Clock className="w-4 h-4 text-slate-300 mx-auto" />;
  if (submission.excused)
    return (
      <span className="text-xs font-medium text-blue-500">Excused</span>
    );
  if (submission.missing)
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-500">
        <AlertTriangle className="w-3 h-3" /> Missing
      </span>
    );
  if (submission.late)
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-500">
        <Clock className="w-3 h-3" /> Late
      </span>
    );
  if (submission.submitted_at)
    return <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />;
  return <Clock className="w-4 h-4 text-slate-300 mx-auto" />;
}

export default async function CourseGradePage({ params }: Props) {
  const { courseId } = await params;
  return (
    <div>
      <Link
        href="/grades"
        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Grades
      </Link>
      <Header title="Course Grades" description="Assignment scores and status" />
      <Suspense fallback={<LoadingPage />}>
        <CourseGradesContent courseId={parseInt(courseId)} />
      </Suspense>
    </div>
  );
}
