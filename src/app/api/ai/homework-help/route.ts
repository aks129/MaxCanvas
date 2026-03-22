import { NextRequest } from "next/server";
import { getHomeworkHelp } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const { assignmentDescription, rubric, question } = await request.json();

    if (!question || !assignmentDescription) {
      return new Response("Missing required fields", { status: 400 });
    }

    const stream = await getHomeworkHelp(assignmentDescription, rubric, question);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Homework help error:", error);
    return new Response("Failed to generate help", { status: 500 });
  }
}
