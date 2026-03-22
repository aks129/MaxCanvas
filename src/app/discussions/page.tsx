import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { LoadingPage } from "@/components/common/loading";
import { ErrorDisplay } from "@/components/common/error";
import { EmptyState } from "@/components/common/empty-state";
import { formatDate } from "@/lib/utils";
import { getCourses, getDiscussionTopics } from "@/lib/canvas";
import { MessageSquare, MessageCircle } from "lucide-react";

async function DiscussionsContent() {
  try {
    const courses = await getCourses();
    const topicsPerCourse = await Promise.all(
      courses.map(async (course) => {
        try {
          const topics = await getDiscussionTopics(course.id);
          return topics.map((t) => ({ ...t, course_name: course.name }));
        } catch {
          return [];
        }
      })
    );

    const allTopics = topicsPerCourse
      .flat()
      .sort(
        (a, b) =>
          new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime()
      );

    if (allTopics.length === 0) {
      return (
        <EmptyState
          icon={<MessageSquare className="w-12 h-12" />}
          title="No discussions"
          description="No discussion topics found across your courses."
        />
      );
    }

    return (
      <div className="space-y-3">
        {allTopics.map((topic) => (
          <div
            key={`${topic.course_id}-${topic.id}`}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"
          >
            <div className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-medium text-slate-900 dark:text-slate-100">
                  {topic.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {topic.course_name} &middot; {topic.author?.display_name}{" "}
                  &middot; {formatDate(topic.posted_at)}
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <MessageSquare className="w-3 h-3" />
                {topic.discussion_subentry_count}
                {topic.unread_count > 0 && (
                  <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5">
                    {topic.unread_count} new
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    return (
      <ErrorDisplay
        title="Could not load discussions"
        message={
          error instanceof Error
            ? error.message
            : "Failed to fetch discussions."
        }
      />
    );
  }
}

export default function DiscussionsPage() {
  return (
    <div>
      <Header
        title="Discussions"
        description="Discussion topics across all courses"
      />
      <Suspense fallback={<LoadingPage />}>
        <DiscussionsContent />
      </Suspense>
    </div>
  );
}
