import { NextRequest } from "next/server";
import { getAIInsights } from "@/lib/ai";
import { getGradesForAllCourses } from "@/lib/canvas";

export async function POST(_request: NextRequest) {
  try {
    const grades = await getGradesForAllCourses();
    const gradesText = grades
      .map(
        (g) =>
          `${g.course_name}: ${g.current_score !== null ? `${g.current_score}% (${g.current_grade || "N/A"})` : "No grade"}`
      )
      .join("\n");

    const insights = await getAIInsights(gradesText);

    return Response.json({ insights });
  } catch (error) {
    console.error("Insights error:", error);
    return new Response("Failed to generate insights", { status: 500 });
  }
}
