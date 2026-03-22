import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return client;
}

export async function getHomeworkHelp(
  assignmentDescription: string,
  rubric: string | null,
  userQuestion: string
): Promise<ReadableStream> {
  const anthropic = getClient();

  const systemPrompt = `You are a helpful, encouraging tutor helping a student understand their school assignment.

Rules:
- Help the student understand the assignment instructions and how to approach it
- NEVER provide direct answers or complete the work for them
- Ask guiding questions to help them think through the problem
- Reference the rubric when relevant to help them understand what's expected
- Keep explanations age-appropriate and encouraging
- If they seem stuck, break the task into smaller steps`;

  const messages: Anthropic.MessageParam[] = [
    {
      role: "user",
      content: `Assignment: ${assignmentDescription}\n\n${rubric ? `Rubric: ${rubric}\n\n` : ""}Student question: ${userQuestion}`,
    },
  ];

  const stream = await anthropic.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  return new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          controller.enqueue(
            new TextEncoder().encode(event.delta.text)
          );
        }
      }
      controller.close();
    },
  });
}

export async function getParentCatchUp(
  childName: string,
  data: {
    announcements: string;
    grades: string;
    upcomingAssignments: string;
  }
): Promise<string> {
  const anthropic = getClient();

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: `You are a helpful school assistant summarizing a student's week for their parent. Write conversationally for a busy parent. Structure your response as:
1. 🚨 Needs Attention Now (missing work, low grades, urgent items)
2. 📅 Upcoming Deadlines (next 7 days)
3. ✅ Good News (completed work, good grades, positive updates)

Be concise but thorough. If there's nothing concerning, say so clearly.`,
    messages: [
      {
        role: "user",
        content: `Summarize ${childName}'s school week:\n\nAnnouncements:\n${data.announcements}\n\nGrades:\n${data.grades}\n\nUpcoming Assignments:\n${data.upcomingAssignments}`,
      },
    ],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  return textBlock?.text || "Unable to generate summary.";
}

export async function getAIInsights(gradesData: string): Promise<string> {
  const anthropic = getClient();

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 512,
    system: `You are a parent advisor analyzing a student's grades. Provide 3-5 brief, actionable insights. Flag concerns (missing work, declining trends). Suggest conversation starters with the child. Keep it supportive, not alarming.`,
    messages: [
      {
        role: "user",
        content: `Analyze these grades and provide insights:\n\n${gradesData}`,
      },
    ],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  return textBlock?.text || "Unable to generate insights.";
}
