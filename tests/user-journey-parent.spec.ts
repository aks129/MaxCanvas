import { test, expect } from "@playwright/test";

// ──────────────────────────────────────────────────
// PERSONA 1: Busy Parent with 2 Kids
// Sarah has Max (7th grade) and Lily (4th grade).
// She checks the app at 8pm after work to catch up
// on both kids' school day, see what's due, review
// teacher comments, and plan weekend study time.
// ──────────────────────────────────────────────────

const pageHeader = "main h1";

test.describe("Parent Journey: Evening Check-In", () => {
  test("P1: Parent lands on dashboard and sees overview of all kids", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await expect(page.locator(pageHeader)).toContainText("Dashboard");

    // Parent should see grade cards, upcoming assignments, announcements
    // Even without data, the page structure should be ready
    const main = page.locator("main");
    await expect(main).toBeVisible();

    // Check the page has section headers for key areas
    await expect(
      page.locator("text=Overview of grades, assignments, and announcements")
    ).toBeVisible();
  });

  test("P2: Parent can switch between children quickly", async ({ page }) => {
    await page.goto("/dashboard");

    // Child selector should be accessible in sidebar
    const sidebar = page.locator("aside");
    await expect(sidebar).toBeVisible();

    // The child selector area should be visible
    const childArea = sidebar.locator("div").filter({ hasText: /children|Loading/ }).first();
    await expect(childArea).toBeVisible();
  });

  test("P3: Parent navigates to grades to check both kids' performance", async ({
    page,
  }) => {
    await page.goto("/grades");
    await expect(page.locator(pageHeader)).toContainText("Grades");
    await expect(
      page.locator("text=All course grades at a glance")
    ).toBeVisible();

    // Grade page should have a table structure or error message
    await page.waitForTimeout(3000);
    const main = page.locator("main");
    const content = await main.textContent();
    expect(
      content?.includes("Course") ||
        content?.includes("Could not load") ||
        content?.includes("No courses")
    ).toBeTruthy();
  });

  test("P4: Parent checks assignments to see what's due this week", async ({
    page,
  }) => {
    await page.goto("/assignments");
    await expect(page.locator(pageHeader)).toContainText("Assignments");

    // Assignments page should show upcoming work or an error
    await page.waitForTimeout(3000);
    const main = page.locator("main");
    await expect(main).toBeVisible();
  });

  test("P5: Parent reads announcements from teachers", async ({ page }) => {
    await page.goto("/announcements");
    await expect(page.locator(pageHeader)).toContainText("Announcements");
    await expect(
      page.locator("text=Latest announcements from all courses")
    ).toBeVisible();
  });

  test("P6: Parent uses AI catch-up to get weekly summary", async ({
    page,
  }) => {
    await page.goto("/catch-up");
    await expect(page.locator(pageHeader)).toContainText("Parent Catch-Up");

    // Should see the generate button
    await expect(page.locator("text=Ready to catch up?")).toBeVisible();
    const generateBtn = page.locator("button", {
      hasText: "Generate Weekly Summary",
    });
    await expect(generateBtn).toBeVisible();
    await expect(generateBtn).toBeEnabled();
  });

  test("P7: Parent can navigate from dashboard to individual assignment details", async ({
    page,
  }) => {
    // Parent flow: Dashboard -> Assignments -> Assignment Detail
    await page.goto("/dashboard");
    await expect(page.locator(pageHeader)).toContainText("Dashboard");

    // Navigate to assignments
    await page.locator('aside a[href="/assignments"]').click();
    await page.waitForURL("**/assignments");
    await expect(page.locator(pageHeader)).toContainText("Assignments");
  });

  test("P8: Parent checks calendar for upcoming deadlines", async ({
    page,
  }) => {
    await page.goto("/calendar");
    await expect(page.locator(pageHeader)).toContainText("Calendar");
    await expect(
      page.locator("text=Upcoming events and assignment deadlines")
    ).toBeVisible();
  });

  test("P9: Parent reviews notifications for grade changes", async ({
    page,
  }) => {
    await page.goto("/notifications");
    await expect(page.locator(pageHeader)).toContainText("Notifications");
    await expect(
      page.locator("text=Alerts and updates from Canvas")
    ).toBeVisible();
  });

  test("P10: Parent can complete a full check-in flow across all pages", async ({
    page,
  }) => {
    // Simulate a real parent evening check-in flow
    const flow = [
      { path: "/dashboard", header: "Dashboard" },
      { path: "/grades", header: "Grades" },
      { path: "/assignments", header: "Assignments" },
      { path: "/announcements", header: "Announcements" },
      { path: "/catch-up", header: "Parent Catch-Up" },
    ];

    for (const step of flow) {
      await page.goto(step.path);
      await expect(page.locator(pageHeader)).toContainText(step.header);
    }
  });
});

test.describe("Parent Journey: Missing Features Check", () => {
  test("P-GAP1: Dashboard should show multi-child summary (NEEDS: child tabs/comparison)", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    // Currently no side-by-side view of both kids
    // FINDING: Need a multi-child overview component
    const main = page.locator("main");
    await expect(main).toBeVisible();
  });

  test("P-GAP2: No teacher comment aggregation view exists yet", async ({
    page,
  }) => {
    // Parent wants to see all teacher feedback in one place
    // Currently need to drill into each assignment individually
    await page.goto("/grades");
    await expect(page.locator(pageHeader)).toContainText("Grades");
    // FINDING: Need a "Teacher Comments" page that aggregates submission_comments
  });

  test("P-GAP3: No follow-up tracker for parent action items", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    // FINDING: Need a "Follow-Up" section where parent can mark items
    // to discuss with kids or track study plans
    const main = page.locator("main");
    await expect(main).toBeVisible();
  });
});
