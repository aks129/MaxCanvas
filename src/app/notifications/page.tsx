import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { LoadingPage } from "@/components/common/loading";
import { ErrorDisplay } from "@/components/common/error";
import { EmptyState } from "@/components/common/empty-state";
import { formatDateTime } from "@/lib/utils";
import { callTool } from "@/lib/mcp-client";
import { Bell, ExternalLink } from "lucide-react";
import type { CanvasNotification } from "@/types/canvas";

async function NotificationsContent() {
  try {
    const result = await callTool("canvas_list_notifications");
    const notifications = (result as CanvasNotification[]) || [];

    if (notifications.length === 0) {
      return (
        <EmptyState
          icon={<Bell className="w-12 h-12" />}
          title="No notifications"
          description="You're all caught up! No new notifications."
        />
      );
    }

    return (
      <div className="space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white dark:bg-slate-800 rounded-lg border p-4 ${
              notification.read_state === "unread"
                ? "border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10"
                : "border-slate-200 dark:border-slate-700"
            }`}
          >
            <div className="flex items-start gap-3">
              <Bell
                className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                  notification.read_state === "unread"
                    ? "text-blue-500"
                    : "text-slate-300"
                }`}
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {notification.subject}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                  {notification.message}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {formatDateTime(notification.created_at)}
                </p>
              </div>
              {notification.html_url && (
                <a
                  href={notification.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    return (
      <ErrorDisplay
        title="Could not load notifications"
        message={
          error instanceof Error
            ? error.message
            : "Failed to fetch notifications."
        }
      />
    );
  }
}

export default function NotificationsPage() {
  return (
    <div>
      <Header
        title="Notifications"
        description="Alerts and updates from Canvas"
      />
      <Suspense fallback={<LoadingPage />}>
        <NotificationsContent />
      </Suspense>
    </div>
  );
}
