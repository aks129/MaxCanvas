import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { LoadingPage } from "@/components/common/loading";
import { ErrorDisplay } from "@/components/common/error";
import { EmptyState } from "@/components/common/empty-state";
import { cn, formatDateTime } from "@/lib/utils";
import { getCalendarEvents, getUpcomingAssignments } from "@/lib/canvas";
import { Calendar as CalIcon, Clock, BookOpen } from "lucide-react";

function getWeekRange(): { start: string; end: string } {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  const end = new Date(start);
  end.setDate(start.getDate() + 13); // 2 weeks
  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
}

async function CalendarContent() {
  try {
    const { start, end } = getWeekRange();
    const [events, assignments] = await Promise.all([
      getCalendarEvents(start, end),
      getUpcomingAssignments(),
    ]);

    // Combine events and assignments into a unified timeline
    const allEvents = [
      ...events.map((e) => ({
        id: `event-${e.id}`,
        title: e.title,
        date: e.start_at,
        type: "event" as const,
        context: e.context_name || "",
      })),
      ...assignments.map((a) => ({
        id: `assignment-${a.id}`,
        title: a.name,
        date: a.due_at || "",
        type: "assignment" as const,
        context: a.course_name || `Course ${a.course_id}`,
      })),
    ]
      .filter((e) => e.date)
      .sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

    // Group by date
    const grouped = allEvents.reduce(
      (acc, event) => {
        const dateKey = new Date(event.date).toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        });
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(event);
        return acc;
      },
      {} as Record<string, typeof allEvents>
    );

    if (Object.keys(grouped).length === 0) {
      return (
        <EmptyState
          icon={<CalIcon className="w-12 h-12" />}
          title="No events this week"
          description="No calendar events or assignments due in the next two weeks."
        />
      );
    }

    return (
      <div className="space-y-6">
        {Object.entries(grouped).map(([date, dayEvents]) => (
          <div key={date}>
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
              {date}
            </h3>
            <div className="space-y-2">
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className={cn(
                    "bg-white dark:bg-slate-800 rounded-lg border p-4 flex items-start gap-3",
                    event.type === "assignment"
                      ? "border-blue-200 dark:border-blue-800"
                      : "border-slate-200 dark:border-slate-700"
                  )}
                >
                  {event.type === "assignment" ? (
                    <BookOpen className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <CalIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                      {event.title}
                    </p>
                    <p className="text-xs text-slate-500">{event.context}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="w-3 h-3" />
                    {formatDateTime(event.date)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    return (
      <ErrorDisplay
        title="Could not load calendar"
        message={
          error instanceof Error
            ? error.message
            : "Failed to fetch calendar events."
        }
      />
    );
  }
}

export default function CalendarPage() {
  return (
    <div>
      <Header
        title="Calendar"
        description="Upcoming events and assignment deadlines"
      />
      <Suspense fallback={<LoadingPage />}>
        <CalendarContent />
      </Suspense>
    </div>
  );
}
