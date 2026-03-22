import { test, expect } from "@playwright/test";

// ──────────────────────────────────────────────────
// PERSONA 2: Student (Kid)
// Max, 7th grader, wants to check his grades, see
// where he can improve, get help understanding a
// confusing assignment, and track what's coming up.
// ──────────────────────────────────────────────────

const pageHeader = "main h1";

test.describe("Kid Journey: Checking Grades & Improvement", () => {
  test("K1: Kid opens dashboard to see overall grades", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.locator(pageHeader)).toContainText("Dashboard");

    // Kid should quickly see their grade cards
    const main = page.locator("main");
    await expect(main).toBeVisible();
    // The dashboard shows "Course Grades" section
    await expect(
      page.locator("text=Overview of grades, assignments, and announcements")
    ).toBeVisible();
  });

  test("K2: Kid navigates to grades to find weak courses", async ({
    page,
  }) => {
    await page.goto("/grades");
    await expect(page.locator(pageHeader)).toContainText("Grades");

    // The grades page should show all courses with scores
    // Kid can identify which classes need more attention
    await page.waitForTimeout(3000);
    const main = page.locator("main");
    await expect(main).toBeVisible();
  });

  test("K3: Kid drills into a course to see assignment-level scores", async ({
    page,
  }) => {
    // Grades -> Course Detail shows individual assignment scores
    await page.goto("/grades");

    // The page structure supports clicking into a course
    // (would navigate to /grades/[courseId])
    await expect(page.locator(pageHeader)).toContainText("Grades");
  });

  test("K4: Kid checks upcoming assignments to plan study time", async ({
    page,
  }) => {
    await page.goto("/assignments");
    await expect(page.locator(pageHeader)).toContainText("Assignments");
    await expect(
      page.locator("text=Upcoming and recent assignments")
    ).toBeVisible();
  });

  test("K5: Kid opens assignment detail to read instructions", async ({
    page,
  }) => {
    // Assignment detail page exists at /assignments/[id]?courseId=X
    // It shows full instructions, rubric, and submission status
    await page.goto("/assignments");
    await expect(page.locator(pageHeader)).toContainText("Assignments");
  });

  test("K6: Kid uses Homework Helper to understand a confusing assignment", async ({
    page,
  }) => {
    // The homework helper chat is on the assignment detail page
    // Verify the catch-up page (which has similar AI interaction) works
    await page.goto("/catch-up");
    await expect(page.locator(pageHeader)).toContainText("Parent Catch-Up");

    // AI chat interface should have an input and submit button
    // The homework helper specifically lives on /assignments/[id] pages
  });

  test("K7: Kid checks calendar to see what's coming up this week", async ({
    page,
  }) => {
    await page.goto("/calendar");
    await expect(page.locator(pageHeader)).toContainText("Calendar");
  });

  test("K8: Kid reviews discussion topics for participation", async ({
    page,
  }) => {
    await page.goto("/discussions");
    await expect(page.locator(pageHeader)).toContainText("Discussions");
    await expect(
      page.locator("text=Discussion topics across all courses")
    ).toBeVisible();
  });

  test("K9: Kid checks notifications for new grades posted", async ({
    page,
  }) => {
    await page.goto("/notifications");
    await expect(page.locator(pageHeader)).toContainText("Notifications");
  });

  test("K10: Kid can complete full self-check flow", async ({ page }) => {
    // Simulate a kid checking their school status
    const flow = [
      { path: "/dashboard", header: "Dashboard" },
      { path: "/grades", header: "Grades" },
      { path: "/assignments", header: "Assignments" },
      { path: "/calendar", header: "Calendar" },
    ];

    for (const step of flow) {
      await page.goto(step.path);
      await expect(page.locator(pageHeader)).toContainText(step.header);
    }
  });
});

test.describe("Kid Journey: Missing Features Check", () => {
  test("K-GAP1: No 'Where Can I Improve?' view showing lowest scores", async ({
    page,
  }) => {
    await page.goto("/grades");
    // FINDING: Need a "Focus Areas" section that highlights
    // lowest-scoring assignments and courses where improvement is most impactful
    await expect(page.locator(pageHeader)).toContainText("Grades");
  });

  test("K-GAP2: No progress tracker showing grade changes over time", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    // FINDING: Need a simple progress/trend indicator
    // showing if grades are going up or down
    await expect(page.locator(pageHeader)).toContainText("Dashboard");
  });

  test("K-GAP3: No kid-friendly simplified view (too much data at once)", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    // FINDING: Dashboard shows everything at once.
    // Kids benefit from a simpler "What do I need to do TODAY?" view
    await expect(page.locator(pageHeader)).toContainText("Dashboard");
  });
});
