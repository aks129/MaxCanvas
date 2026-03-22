import { callTool } from "./mcp-client";
import type {
  CanvasCourse,
  CanvasAssignment,
  CanvasSubmission,
  CanvasAnnouncement,
  CanvasCalendarEvent,
  CanvasModule,
  CanvasModuleItem,
  CanvasDiscussionTopic,
  CanvasGradeInfo,
} from "@/types/canvas";

// ── Courses ──────────────────────────────────────────────

export async function getCourses(): Promise<CanvasCourse[]> {
  const result = await callTool("canvas_list_courses", {
    enrollment_state: "active",
    include: ["total_scores", "current_grading_period_scores"],
  });
  return (result as CanvasCourse[]) || [];
}

export async function getCourse(courseId: number): Promise<CanvasCourse> {
  const result = await callTool("canvas_get_course", {
    course_id: courseId,
  });
  return result as CanvasCourse;
}

// ── Grades ───────────────────────────────────────────────

export async function getGradesForAllCourses(): Promise<CanvasGradeInfo[]> {
  const courses = await getCourses();
  return courses.map((course) => {
    const enrollment = course.enrollments?.find(
      (e) => e.type === "student" || e.type === "observer"
    );
    return {
      course_id: course.id,
      course_name: course.name,
      current_score: enrollment?.computed_current_score ?? null,
      current_grade: enrollment?.computed_current_grade ?? null,
      final_score: enrollment?.computed_final_score ?? null,
      final_grade: enrollment?.computed_final_grade ?? null,
    };
  });
}

// ── Assignments ──────────────────────────────────────────

export async function getAssignments(
  courseId: number
): Promise<CanvasAssignment[]> {
  const result = await callTool("canvas_list_assignments", {
    course_id: courseId,
    order_by: "due_at",
  });
  return (result as CanvasAssignment[]) || [];
}

export async function getAssignment(
  courseId: number,
  assignmentId: number
): Promise<CanvasAssignment> {
  const result = await callTool("canvas_get_assignment", {
    course_id: courseId,
    assignment_id: assignmentId,
  });
  return result as CanvasAssignment;
}

export async function getUpcomingAssignments(): Promise<CanvasAssignment[]> {
  const result = await callTool("canvas_get_upcoming_assignments");
  return (result as CanvasAssignment[]) || [];
}

// ── Submissions ──────────────────────────────────────────

export async function getSubmission(
  courseId: number,
  assignmentId: number
): Promise<CanvasSubmission> {
  const result = await callTool("canvas_get_submission", {
    course_id: courseId,
    assignment_id: assignmentId,
    include: ["submission_comments"],
  });
  return result as CanvasSubmission;
}

export async function getSubmissions(
  courseId: number
): Promise<CanvasSubmission[]> {
  const result = await callTool("canvas_list_submissions", {
    course_id: courseId,
    include: ["assignment"],
  });
  return (result as CanvasSubmission[]) || [];
}

// ── Announcements ────────────────────────────────────────

export async function getAnnouncements(
  courseIds?: number[]
): Promise<CanvasAnnouncement[]> {
  const args: Record<string, unknown> = {};
  if (courseIds?.length) {
    args.context_codes = courseIds.map((id) => `course_${id}`);
  }
  const result = await callTool("canvas_list_announcements", args);
  return (result as CanvasAnnouncement[]) || [];
}

// ── Calendar ─────────────────────────────────────────────

export async function getCalendarEvents(
  startDate: string,
  endDate: string
): Promise<CanvasCalendarEvent[]> {
  const result = await callTool("canvas_list_calendar_events", {
    start_date: startDate,
    end_date: endDate,
    type: "event",
  });
  return (result as CanvasCalendarEvent[]) || [];
}

// ── Modules ──────────────────────────────────────────────

export async function getModules(courseId: number): Promise<CanvasModule[]> {
  const result = await callTool("canvas_list_modules", {
    course_id: courseId,
  });
  return (result as CanvasModule[]) || [];
}

export async function getModuleItems(
  courseId: number,
  moduleId: number
): Promise<CanvasModuleItem[]> {
  const result = await callTool("canvas_list_module_items", {
    course_id: courseId,
    module_id: moduleId,
  });
  return (result as CanvasModuleItem[]) || [];
}

// ── Discussions ──────────────────────────────────────────

export async function getDiscussionTopics(
  courseId: number
): Promise<CanvasDiscussionTopic[]> {
  const result = await callTool("canvas_list_discussion_topics", {
    course_id: courseId,
  });
  return (result as CanvasDiscussionTopic[]) || [];
}

// ── Dashboard ────────────────────────────────────────────

export async function getDashboardCards(): Promise<unknown[]> {
  const result = await callTool("canvas_get_dashboard_cards");
  return (result as unknown[]) || [];
}
