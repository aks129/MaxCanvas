export interface CanvasCourse {
  id: number;
  name: string;
  course_code: string;
  enrollment_term_id: number;
  workflow_state: string;
  start_at: string | null;
  end_at: string | null;
  enrollments?: CanvasEnrollment[];
}

export interface CanvasEnrollment {
  type: string;
  role: string;
  enrollment_state: string;
  computed_current_score: number | null;
  computed_final_score: number | null;
  computed_current_grade: string | null;
  computed_final_grade: string | null;
}

export interface CanvasAssignment {
  id: number;
  name: string;
  description: string | null;
  due_at: string | null;
  points_possible: number;
  course_id: number;
  course_name?: string;
  html_url: string;
  submission_types: string[];
  has_submitted_submissions: boolean;
  rubric?: CanvasRubricCriterion[];
  lock_at: string | null;
  unlock_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CanvasRubricCriterion {
  id: string;
  description: string;
  long_description: string;
  points: number;
  ratings: {
    id: string;
    description: string;
    points: number;
  }[];
}

export interface CanvasSubmission {
  id: number;
  assignment_id: number;
  user_id: number;
  score: number | null;
  grade: string | null;
  submitted_at: string | null;
  workflow_state: string;
  late: boolean;
  missing: boolean;
  excused: boolean;
  grade_matches_current_submission: boolean;
  submission_comments?: CanvasComment[];
}

export interface CanvasComment {
  id: number;
  author_name: string;
  comment: string;
  created_at: string;
}

export interface CanvasAnnouncement {
  id: number;
  title: string;
  message: string;
  posted_at: string;
  context_code: string;
  course_name?: string;
  author: {
    display_name: string;
  };
}

export interface CanvasCalendarEvent {
  id: number;
  title: string;
  description: string | null;
  start_at: string;
  end_at: string;
  context_code: string;
  context_name?: string;
  type: string;
  assignment?: CanvasAssignment;
}

export interface CanvasModule {
  id: number;
  name: string;
  position: number;
  state: string;
  completed_at: string | null;
  items_count: number;
  items_url: string;
}

export interface CanvasModuleItem {
  id: number;
  title: string;
  type: string;
  content_id: number;
  html_url: string;
  completion_requirement?: {
    type: string;
    completed: boolean;
  };
}

export interface CanvasDiscussionTopic {
  id: number;
  title: string;
  message: string;
  posted_at: string;
  author: {
    display_name: string;
  };
  discussion_subentry_count: number;
  read_state: string;
  unread_count: number;
  course_id: number;
}

export interface CanvasNotification {
  id: number;
  subject: string;
  message: string;
  created_at: string;
  type: string;
  read_state: string;
  html_url: string;
  context_type: string;
}

export interface CanvasGradeInfo {
  course_id: number;
  course_name: string;
  current_score: number | null;
  current_grade: string | null;
  final_score: number | null;
  final_grade: string | null;
}
