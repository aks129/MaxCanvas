import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { GradeSummaryCard } from "@/components/dashboard/grade-summary-card";
import { UpcomingAssignments } from "@/components/dashboard/upcoming-assignments";
import { AnnouncementsFeed } from "@/components/dashboard/announcements-feed";
import { LoadingPage } from "@/components/common/loading";
import { ErrorDisplay } from "@/components/common/error";
import {
  getGradesForAllCourses,
  getUpcomingAssignments,
  getAnnouncements,
} from "@/lib/canvas";

async function DashboardContent() {
  try {
    const [grades, upcoming, announcements] = await Promise.all([
      getGradesForAllCourses(),
      getUpcomingAssignments(),
      getAnnouncements(),
    ]);

    return (
      <>
        {/* Grades Overview */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Course Grades
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {grades.map((grade) => (
              <GradeSummaryCard key={grade.course_id} grade={grade} />
            ))}
          </div>
          {grades.length === 0 && (
            <p className="text-sm text-slate-400 py-4">
              No active courses found.
            </p>
          )}
        </section>

        {/* Two-column: Upcoming + Announcements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UpcomingAssignments assignments={upcoming} />
          <AnnouncementsFeed announcements={announcements} />
        </div>
      </>
    );
  } catch (error) {
    return (
      <ErrorDisplay
        title="Could not load dashboard"
        message={
          error instanceof Error
            ? error.message
            : "Failed to connect to Canvas. Make sure the MCP server is running."
        }
      />
    );
  }
}

export default function DashboardPage() {
  return (
    <div>
      <Header
        title="Dashboard"
        description="Overview of grades, assignments, and announcements"
      />
      <Suspense fallback={<LoadingPage />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
