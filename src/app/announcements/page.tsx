import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { LoadingPage } from "@/components/common/loading";
import { ErrorDisplay } from "@/components/common/error";
import { EmptyState } from "@/components/common/empty-state";
import { formatDate, stripHtml } from "@/lib/utils";
import { getAnnouncements } from "@/lib/canvas";
import { Megaphone } from "lucide-react";

async function AnnouncementsContent() {
  try {
    const announcements = await getAnnouncements();

    if (announcements.length === 0) {
      return (
        <EmptyState
          icon={<Megaphone className="w-12 h-12" />}
          title="No announcements"
          description="No announcements from your courses."
        />
      );
    }

    return (
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                {announcement.title}
              </h3>
              <span className="text-xs text-slate-400 whitespace-nowrap">
                {formatDate(announcement.posted_at)}
              </span>
            </div>
            <p className="text-xs text-blue-500 mb-2">
              {announcement.author?.display_name} &middot;{" "}
              {announcement.course_name || announcement.context_code}
            </p>
            <div
              className="text-sm text-slate-600 dark:text-slate-400 prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{
                __html: announcement.message || stripHtml(announcement.message),
              }}
            />
          </div>
        ))}
      </div>
    );
  } catch (error) {
    return (
      <ErrorDisplay
        title="Could not load announcements"
        message={
          error instanceof Error
            ? error.message
            : "Failed to fetch announcements."
        }
      />
    );
  }
}

export default function AnnouncementsPage() {
  return (
    <div>
      <Header
        title="Announcements"
        description="Latest announcements from all courses"
      />
      <Suspense fallback={<LoadingPage />}>
        <AnnouncementsContent />
      </Suspense>
    </div>
  );
}
