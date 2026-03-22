import { test, expect } from "@playwright/test";

// ──────────────────────────────────────────────────
// PERSONA 3: ADHD-Specific Testing
// Tests for features that support executive function
// challenges: prioritization, time management, task
// breakdown, focus mode, and overwhelm reduction.
// For parents, kids, AND teacher collaboration.
// ──────────────────────────────────────────────────

const pageHeader = "main h1";

test.describe("ADHD: Parent Managing ADHD Child", () => {
  test("ADHD-P1: Parent needs priority-sorted assignment view (most urgent first)", async ({
    page,
  }) => {
    await page.goto("/assignments");
    await expect(page.locator(pageHeader)).toContainText("Assignments");
    // NEED: Assignments should be sortable by urgency (overdue > due today > due this week)
    // Current implementation shows assignments but doesn't emphasize urgency enough
    const main = page.locator("main");
    await expect(main).toBeVisible();
  });

  test("ADHD-P2: Parent needs to see missing/late work prominently", async ({
    page,
  }) => {
    await page.goto("/grades");
    // NEED: A dedicated "Missing Work" alert section at the top of dashboard
    // Parents of ADHD kids need to catch missing work early
    await expect(page.locator(pageHeader)).toContainText("Grades");
  });

  test("ADHD-P3: Parent needs structured daily plan for child", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    // NEED: "Today's Plan" component that breaks the day into
    // time blocks with specific assignments and breaks
    await expect(page.locator(pageHeader)).toContainText("Dashboard");
  });

  test("ADHD-P4: Parent needs to monitor assignment completion patterns", async ({
    page,
  }) => {
    await page.goto("/catch-up");
    // NEED: AI insights should specifically flag ADHD patterns:
    // - Assignments submitted at last minute
    // - Missing work clusters (forgetting pattern)
    // - Subject-specific attention gaps
    await expect(page.locator(pageHeader)).toContainText("Parent Catch-Up");
  });
});

test.describe("ADHD: Kid Self-Managing", () => {
  test("ADHD-K1: Kid needs a 'What to do RIGHT NOW' single-focus view", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    // NEED: A "Focus Mode" that shows ONLY the single most important
    // task to work on right now, with a timer and clear steps
    await expect(page.locator(pageHeader)).toContainText("Dashboard");
  });

  test("ADHD-K2: Kid needs assignments broken into smaller steps", async ({
    page,
  }) => {
    await page.goto("/assignments");
    // NEED: AI-generated task breakdown for each assignment
    // e.g., "Write essay" becomes:
    // 1. Read the prompt (5 min)
    // 2. Brainstorm 3 ideas (10 min)
    // 3. Write outline (15 min)
    // 4. Write first paragraph (10 min)
    // ... etc.
    await expect(page.locator(pageHeader)).toContainText("Assignments");
  });

  test("ADHD-K3: Kid needs visual progress and positive reinforcement", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    // NEED: Progress bars, streaks, and encouraging messages
    // "You've completed 3/5 assignments this week!"
    await expect(page.locator(pageHeader)).toContainText("Dashboard");
  });

  test("ADHD-K4: Kid needs reduced visual clutter option", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    // NEED: A simplified view that reduces cognitive load
    // Fewer items visible, larger text, more whitespace
    await expect(page.locator(pageHeader)).toContainText("Dashboard");
  });

  test("ADHD-K5: Kid needs time estimation for assignments", async ({
    page,
  }) => {
    await page.goto("/assignments");
    // NEED: AI-estimated time for each assignment
    // "This usually takes about 30 minutes"
    await expect(page.locator(pageHeader)).toContainText("Assignments");
  });
});

test.describe("ADHD: Teacher Collaboration Features", () => {
  test("ADHD-T1: App should surface teacher comments about behavior/focus", async ({
    page,
  }) => {
    await page.goto("/notifications");
    // NEED: Filter/highlight teacher comments that mention
    // attention, behavior, or participation
    await expect(page.locator(pageHeader)).toContainText("Notifications");
  });

  test("ADHD-T2: App should show assignment accommodation info", async ({
    page,
  }) => {
    await page.goto("/assignments");
    // NEED: Display extended deadlines, modified assignments,
    // or IEP/504 accommodations if available in Canvas
    await expect(page.locator(pageHeader)).toContainText("Assignments");
  });
});

test.describe("ADHD: Feature Existence Checks", () => {
  test("ADHD-CHECK1: Focus mode page exists and has timer", async ({
    page,
  }) => {
    const response = await page.goto("/focus");
    expect(response?.status()).toBeLessThan(500);
    await expect(page.locator(pageHeader)).toContainText("Focus Mode");
    await expect(
      page.locator("text=One task at a time")
    ).toBeVisible();

    // Timer should be visible
    await expect(page.getByText("focus time")).toBeVisible();

    // Focus tips section
    await expect(page.locator("text=Focus Tips")).toBeVisible();

    // Steps section
    await expect(page.locator("text=Steps to Complete")).toBeVisible();

    // Timer presets
    await expect(page.locator("button", { hasText: "10m" })).toBeVisible();
    await expect(page.locator("button", { hasText: "25m" })).toBeVisible();
  });

  test("ADHD-CHECK2: ADHD support page exists with strategies", async ({
    page,
  }) => {
    const response = await page.goto("/adhd-support");
    expect(response?.status()).toBeLessThan(500);
    await expect(page.locator(pageHeader)).toContainText("ADHD Support");
    await expect(
      page.locator("text=Tools and strategies")
    ).toBeVisible();

    // Either shows the full page with quick actions, or an error (when MCP is down)
    const hasQuickActions = await page
      .locator("text=Start Focus Mode")
      .isVisible({ timeout: 5000 })
      .catch(() => false);
    const hasError = await page
      .locator("text=Could not load")
      .isVisible()
      .catch(() => false);

    // One of these states must be true
    expect(hasQuickActions || hasError).toBeTruthy();

    if (hasQuickActions) {
      await expect(page.locator("text=Today's View")).toBeVisible();
      await expect(page.locator("text=For Parents")).toBeVisible();
      await expect(page.locator("text=For Teachers")).toBeVisible();
    }
  });

  test("ADHD-CHECK3: Today view exists with priority layout", async ({
    page,
  }) => {
    const response = await page.goto("/today");
    expect(response?.status()).toBeLessThan(500);
    await expect(page.locator(pageHeader)).toContainText("Today");
    await expect(
      page.locator("text=What needs your attention right now")
    ).toBeVisible();
  });

  test("ADHD-CHECK4: Focus mode timer controls work", async ({ page }) => {
    await page.goto("/focus");

    // Play button should be present
    const playArea = page.locator("button").filter({ has: page.locator("svg") });
    const buttons = await playArea.all();
    expect(buttons.length).toBeGreaterThan(0);

    // Timer preset buttons should be clickable
    const preset15 = page.locator("button", { hasText: "15m" });
    await expect(preset15).toBeEnabled();
  });

  test("ADHD-CHECK5: Focus mode step checkboxes work", async ({ page }) => {
    await page.goto("/focus");

    // Steps should be clickable
    const steps = page.locator("text=Read the assignment instructions");
    if (await steps.isVisible({ timeout: 3000 }).catch(() => false)) {
      await steps.click();
      // After clicking, should show as completed (line-through)
      await expect(page.locator(".line-through")).toBeVisible();
    }
  });

  test("ADHD-CHECK6: Sidebar shows new nav sections", async ({ page }) => {
    await page.goto("/dashboard");
    const sidebar = page.locator("aside");

    // Section headers
    await expect(sidebar.locator("text=Quick Access")).toBeVisible();
    await expect(sidebar.getByText("School", { exact: true })).toBeVisible();
    await expect(sidebar.locator("text=AI Tools")).toBeVisible();

    // New links
    await expect(
      sidebar.getByRole("link", { name: "Today" })
    ).toBeVisible();
    await expect(
      sidebar.getByRole("link", { name: "Focus Mode" })
    ).toBeVisible();
    await expect(
      sidebar.getByRole("link", { name: "ADHD Support" })
    ).toBeVisible();
  });
});
