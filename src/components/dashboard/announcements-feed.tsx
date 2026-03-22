import { Megaphone } from "lucide-react";
import { formatDate, stripHtml, truncate } from "@/lib/utils";
import type { CanvasAnnouncement } from "@/types/canvas";

interface AnnouncementsFeedProps {
  announcements: CanvasAnnouncement[];
}

export function AnnouncementsFeed({
  announcements,
}: AnnouncementsFeedProps) {
  if (announcements.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-purple-500" />
          Recent Announcements
        </h3>
        <p className="text-sm text-slate-400 py-4 text-center">
          No recent announcements
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
        <Megaphone className="w-5 h-5 text-purple-500" />
        Recent Announcements
      </h3>
      <div className="space-y-3">
        {announcements.slice(0, 5).map((announcement) => (
          <div
            key={announcement.id}
            className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-1">
                {announcement.title}
              </h4>
              <span className="text-xs text-slate-400 whitespace-nowrap">
                {formatDate(announcement.posted_at)}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
              {truncate(stripHtml(announcement.message), 120)}
            </p>
            <p className="text-xs text-blue-500 mt-1">
              {announcement.author?.display_name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
