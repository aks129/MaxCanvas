import { NextRequest } from "next/server";
import { getParentCatchUp } from "@/lib/ai";
import {
  getGradesForAllCourses,
  getUpcomingAssignments,
  getAnnouncements,
} from "@/lib/canvas";

export async function POST(request: NextRequest) {
  try {
    const { childName } = await request.json();

    const [grades, assignments, announcements] = await Promise.all([
      getGradesForAllCourses(),
      getUpcomingAssignments(),
      getAnnouncements(),
    ]);

    const gradesText = grades
      .map(
        (g) =>
          `${g.course_name}: ${g.current_score !== null ? `${g.current_score}%` : "No grade"}`
      )
      .join("\n");

    const assignmentsText = assignments
      .map((a) => `${a.name} (${a.course_name || "Course"}) - Due: ${a.due_at || "N/A"}`)
      .join("\n");

    const announcementsText = announcements
      .slice(0, 10)
      .map((a) => `[${a.posted_at}] ${a.title}: ${a.message?.slice(0, 100)}`)
      .join("\n");

    const summary = await getParentCatchUp(childName || "your child", {
      announcements: announcementsText || "No recent announcements",
      grades: gradesText || "No grades available",
      upcomingAssignments: assignmentsText || "No upcoming assignments",
    });

    return Response.json({ summary });
  } catch (error) {
    console.error("Catch-up error:", error);
    return new Response("Failed to generate catch-up summary", { status: 500 });
  }
}
