import { Suspense } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { HomeworkHelper } from "@/components/assignments/homework-helper";
import { LoadingPage } from "@/components/common/loading";
import { ErrorDisplay } from "@/components/common/error";
import { formatDateTime, stripHtml } from "@/lib/utils";
import { getAssignment, getSubmission } from "@/lib/canvas";
import {
  ArrowLeft,
  Calendar,
  Award,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface Props {
  params: Promise<{ assignmentId: string }>;
  searchParams: Promise<{ courseId?: string }>;
}

async function AssignmentContent({
  courseId,
  assignmentId,
}: {
  courseId: number;
  assignmentId: number;
}) {
  try {
    const [assignment, submission] = await Promise.all([
      getAssignment(courseId, assignmentId),
      getSubmission(courseId, assignmentId).catch(() => null),
    ]);

    const rubricText = assignment.rubric
      ?.map(
        (c) =>
          `${c.description} (${c.points} pts): ${c.long_description || ""}`
      )
      .join("\n");

    return (
      <div className="space-y-6">
        {/* Assignment Info */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            {assignment.name}
          </h2>

          <div className="flex flex-wrap gap-4 mb-4 text-sm">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Calendar className="w-4 h-4" />
              Due: {formatDateTime(assignment.due_at)}
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Award className="w-4 h-4" />
              {assignment.points_possible} points
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <FileText className="w-4 h-4" />
              {assignment.submission_types?.join(", ") || "No submission type"}
            </div>
          </div>

          {/* Submission Status */}
          {submission && (
            <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-700/50">
              {submission.submitted_at ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-700 dark:text-green-400">
                    Submitted {formatDateTime(submission.submitted_at)}
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-700 dark:text-red-400">
                    Not submitted
                  </span>
                </>
              )}
              {submission.score !== null && (
                <span className="ml-auto font-bold text-slate-900 dark:text-slate-100">
                  {submission.score}/{assignment.points_possible}
                </span>
              )}
            </div>
          )}

          {/* Description */}
          {assignment.description && (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Instructions
              </h3>
              <div
                dangerouslySetInnerHTML={{ __html: assignment.description }}
                className="text-slate-600 dark:text-slate-400"
              />
            </div>
          )}

          {/* Rubric */}
          {assignment.rubric && assignment.rubric.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Rubric
              </h3>
              <div className="space-y-2">
                {assignment.rubric.map((criterion) => (
                  <div
                    key={criterion.id}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50"
                  >
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {criterion.description}
                      </span>
                      <span className="text-sm text-slate-500">
                        {criterion.points} pts
                      </span>
                    </div>
                    {criterion.long_description && (
                      <p className="text-xs text-slate-500 mt-1">
                        {criterion.long_description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submission Comments */}
          {submission?.submission_comments &&
            submission.submission_comments.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Comments
                </h3>
                <div className="space-y-2">
                  {submission.submission_comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20"
                    >
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span className="font-medium">
                          {comment.author_name}
                        </span>
                        <span>{formatDateTime(comment.created_at)}</span>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        {comment.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* Homework Helper */}
        <HomeworkHelper
          assignmentDescription={
            assignment.description
              ? stripHtml(assignment.description)
              : assignment.name
          }
          rubric={rubricText || null}
        />
      </div>
    );
  } catch (error) {
    return (
      <ErrorDisplay
        title="Could not load assignment"
        message={
          error instanceof Error
            ? error.message
            : "Failed to fetch assignment details."
        }
      />
    );
  }
}

export default async function AssignmentDetailPage({
  params,
  searchParams,
}: Props) {
  const { assignmentId } = await params;
  const { courseId } = await searchParams;

  if (!courseId) {
    return (
      <ErrorDisplay
        title="Missing course ID"
        message="Course ID is required to view assignment details."
      />
    );
  }

  return (
    <div>
      <Link
        href="/assignments"
        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Assignments
      </Link>
      <Header title="Assignment Details" />
      <Suspense fallback={<LoadingPage />}>
        <AssignmentContent
          courseId={parseInt(courseId)}
          assignmentId={parseInt(assignmentId)}
        />
      </Suspense>
    </div>
  );
}
