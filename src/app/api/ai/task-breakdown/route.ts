import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(request: NextRequest) {
  try {
    const { assignmentName, description, pointsPossible, dueAt } =
      await request.json();

    if (!assignmentName) {
      return new Response("Missing assignment name", { status: 400 });
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 512,
      system: `You are an ADHD-friendly task coach. Break assignments into small, concrete steps that take 10-20 minutes each. For each step, include an estimated time in minutes. Keep instructions simple and action-oriented. Use encouraging language. Return valid JSON only.

Format:
{"steps": [{"title": "Step description", "minutes": 10}, ...], "totalMinutes": 60, "tip": "One ADHD-specific tip for this type of work"}`,
      messages: [
        {
          role: "user",
          content: `Break this assignment into ADHD-friendly steps:
Name: ${assignmentName}
${description ? `Description: ${description}` : ""}
${pointsPossible ? `Points: ${pointsPossible}` : ""}
${dueAt ? `Due: ${dueAt}` : ""}`,
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    const responseText = textBlock?.text || "{}";

    try {
      const parsed = JSON.parse(responseText);
      return Response.json(parsed);
    } catch {
      return Response.json({
        steps: [
          { title: "Read the assignment instructions", minutes: 5 },
          { title: "Gather materials and notes", minutes: 5 },
          { title: "Start the first section", minutes: 15 },
          { title: "Take a short break", minutes: 5 },
          { title: "Complete remaining sections", minutes: 20 },
          { title: "Review and submit", minutes: 10 },
        ],
        totalMinutes: 60,
        tip: "Set a timer for each step. It's easier to start when you know exactly how long it will take.",
      });
    }
  } catch (error) {
    console.error("Task breakdown error:", error);
    return new Response("Failed to generate task breakdown", { status: 500 });
  }
}
