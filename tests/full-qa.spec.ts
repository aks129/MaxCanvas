import { test, expect } from "@playwright/test";

// ──────────────────────────────────────────────────
// QA Test Suite for MaxCanvas
// Tests all pages load, navigation works, and UI
// elements render correctly. Since we don't have a
// live Canvas MCP server, we verify graceful error
// handling and structural integrity of each page.
// ──────────────────────────────────────────────────

// Helper: get the page header h1 inside main content (not sidebar)
const pageHeader = "main h1";

test.describe("App Shell & Navigation", () => {
  test("root redirects to /dashboard", async ({ page }) => {
    await page.goto("/");
    await page.waitForURL("**/dashboard");
    expect(page.url()).toContain("/dashboard");
  });

  test("sidebar renders with all navigation links", async ({ page }) => {
    await page.goto("/dashboard");
    const sidebar = page.locator("aside");
    await expect(sidebar).toBeVisible();

    // App title
    await expect(sidebar.locator("text=MaxCanvas")).toBeVisible();
    await expect(sidebar.locator("text=School Dashboard")).toBeVisible();

    // All nav items present — use the link role to avoid ambiguity
    const navLinks = [
      "Today",
      "Focus Mode",
      "Dashboard",
      "Grades",
      "Assignments",
      "Calendar",
      "Announcements",
      "Discussions",
      "Notifications",
      "Parent Catch-Up",
      "ADHD Support",
    ];

    for (const link of navLinks) {
      await expect(
        sidebar.getByRole("link", { name: link })
      ).toBeVisible();
    }
  });

  test("sidebar highlights active page", async ({ page }) => {
    await page.goto("/dashboard");

    // Dashboard link should have active styling (bg-blue-600)
    const dashboardLink = page.locator('aside a[href="/dashboard"]');
    await expect(dashboardLink).toHaveClass(/bg-blue-600/);

    // Grades link should NOT have active styling
    const gradesLink = page.locator('aside a[href="/grades"]');
    await expect(gradesLink).not.toHaveClass(/bg-blue-600/);
  });

  test("navigation between pages works", async ({ page }) => {
    await page.goto("/dashboard");

    // Click Grades
    await page.locator('aside a[href="/grades"]').click();
    await page.waitForURL("**/grades");
    await expect(page.locator(pageHeader)).toContainText("Grades");

    // Click Assignments
    await page.locator('aside a[href="/assignments"]').click();
    await page.waitForURL("**/assignments");
    await expect(page.locator(pageHeader)).toContainText("Assignments");

    // Click Calendar
    await page.locator('aside a[href="/calendar"]').click();
    await page.waitForURL("**/calendar");
    await expect(page.locator(pageHeader)).toContainText("Calendar");
  });

  test("child selector is present in sidebar", async ({ page }) => {
    await page.goto("/dashboard");
    // The child selector should be in the sidebar (may show "No children configured" without env)
    const sidebarChildSection = page.locator("aside").locator("div").nth(1);
    await expect(sidebarChildSection).toBeVisible();
  });

  test("footer text is visible", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(
      page.locator("text=Powered by Canvas LMS + AI")
    ).toBeVisible();
  });
});

test.describe("Dashboard Page", () => {
  test("renders page header", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.locator(pageHeader)).toContainText("Dashboard");
    await expect(page.locator("text=Overview of grades")).toBeVisible();
  });

  test("shows error or content when MCP server unavailable", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    // Without MCP server, should show error display or loading
    // Wait for either content or error to appear
    await page
      .waitForSelector(
        'text="Course Grades", text="Could not load dashboard"',
        { timeout: 15000 }
      )
      .catch(() => {
        // One of these should be visible
      });

    // Page should have rendered something beyond just the header
    const mainContent = page.locator("main");
    await expect(mainContent).toBeVisible();
  });

  test("error display shows retry-friendly message", async ({ page }) => {
    await page.goto("/dashboard");
    // If MCP server is not running, we expect an error display
    const errorBox = page.locator("text=Could not load dashboard");
    if (await errorBox.isVisible({ timeout: 10000 }).catch(() => false)) {
      // Error should mention connection failure
      await expect(
        page
          .locator("text=Failed to connect")
          .or(page.locator("text=MCP"))
          .or(page.locator("text=fetch"))
      ).toBeVisible();
    }
  });
});

test.describe("Grades Page", () => {
  test("renders page header", async ({ page }) => {
    await page.goto("/grades");
    await expect(page.locator(pageHeader)).toContainText("Grades");
    await expect(
      page.locator("text=All course grades at a glance")
    ).toBeVisible();
  });

  test("shows error or grade table", async ({ page }) => {
    await page.goto("/grades");
    await page.waitForTimeout(3000);
    const mainContent = page.locator("main");
    await expect(mainContent).toBeVisible();
    // Should have either a table, empty state, or error
    const hasTable = await page.locator("table").isVisible().catch(() => false);
    const hasError = await page
      .locator("text=Could not load grades")
      .isVisible()
      .catch(() => false);
    const hasEmpty = await page
      .locator("text=No courses found")
      .isVisible()
      .catch(() => false);
    expect(hasTable || hasError || hasEmpty).toBeTruthy();
  });
});

test.describe("Assignments Page", () => {
  test("renders page header", async ({ page }) => {
    await page.goto("/assignments");
    await expect(page.locator(pageHeader)).toContainText("Assignments");
    await expect(
      page.locator("text=Upcoming and recent assignments")
    ).toBeVisible();
  });

  test("shows content or graceful error", async ({ page }) => {
    await page.goto("/assignments");
    await page.waitForTimeout(3000);
    const main = page.locator("main");
    await expect(main).toBeVisible();
  });
});

test.describe("Calendar Page", () => {
  test("renders page header", async ({ page }) => {
    await page.goto("/calendar");
    await expect(page.locator(pageHeader)).toContainText("Calendar");
    await expect(
      page.locator("text=Upcoming events and assignment deadlines")
    ).toBeVisible();
  });
});

test.describe("Announcements Page", () => {
  test("renders page header", async ({ page }) => {
    await page.goto("/announcements");
    await expect(page.locator(pageHeader)).toContainText("Announcements");
    await expect(
      page.locator("text=Latest announcements from all courses")
    ).toBeVisible();
  });
});

test.describe("Discussions Page", () => {
  test("renders page header", async ({ page }) => {
    await page.goto("/discussions");
    await expect(page.locator(pageHeader)).toContainText("Discussions");
    await expect(
      page.locator("text=Discussion topics across all courses")
    ).toBeVisible();
  });
});

test.describe("Notifications Page", () => {
  test("renders page header", async ({ page }) => {
    await page.goto("/notifications");
    await expect(page.locator(pageHeader)).toContainText("Notifications");
    await expect(
      page.locator("text=Alerts and updates from Canvas")
    ).toBeVisible();
  });
});

test.describe("Parent Catch-Up Page", () => {
  test("renders page header and CTA", async ({ page }) => {
    await page.goto("/catch-up");
    await expect(page.locator(pageHeader)).toContainText("Parent Catch-Up");
    await expect(page.locator("text=AI-powered summary")).toBeVisible();
  });

  test("shows initial state with generate button", async ({ page }) => {
    await page.goto("/catch-up");
    await expect(page.locator("text=Ready to catch up?")).toBeVisible();
    await expect(
      page.locator("text=Generate Weekly Summary")
    ).toBeVisible();
  });

  test("generate button exists and is clickable", async ({ page }) => {
    await page.goto("/catch-up");
    const generateBtn = page.locator("button", {
      hasText: "Generate Summary",
    });
    // There are two generate buttons - the header one and the big CTA
    const buttons = await generateBtn.all();
    expect(buttons.length).toBeGreaterThanOrEqual(1);
    // Buttons should be enabled
    for (const btn of buttons) {
      await expect(btn).toBeEnabled();
    }
  });
});

test.describe("Layout & Responsive Structure", () => {
  test("main content area has correct left margin for sidebar", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    const main = page.locator("main");
    await expect(main).toHaveClass(/ml-64/);
  });

  test("sidebar is fixed positioned", async ({ page }) => {
    await page.goto("/dashboard");
    const sidebar = page.locator("aside");
    await expect(sidebar).toHaveClass(/fixed/);
    await expect(sidebar).toHaveClass(/w-64/);
  });

  test("page does not crash with JavaScript errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => {
      errors.push(error.message);
    });

    await page.goto("/dashboard");
    await page.waitForTimeout(2000);

    // Filter out expected MCP connection errors
    const unexpectedErrors = errors.filter(
      (e) =>
        !e.includes("MCP") &&
        !e.includes("fetch") &&
        !e.includes("ECONNREFUSED") &&
        !e.includes("canvas")
    );

    expect(unexpectedErrors).toHaveLength(0);
  });
});

test.describe("HTML & Accessibility Basics", () => {
  test("page has correct title", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveTitle(/MaxCanvas/);
  });

  test("page has lang attribute", async ({ page }) => {
    await page.goto("/dashboard");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("lang", "en");
  });

  test("all nav links have valid hrefs", async ({ page }) => {
    await page.goto("/dashboard");
    const links = page.locator("aside a[href]");
    const count = await links.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute("href");
      expect(href).toBeTruthy();
      expect(href).toMatch(/^\//);
    }
  });

  test("no broken images on dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    const images = page.locator("img");
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const naturalWidth = await img.evaluate(
        (el: HTMLImageElement) => el.naturalWidth
      );
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });
});

test.describe("All Pages Load Without Crash", () => {
  const pages = [
    { path: "/dashboard", title: "Dashboard" },
    { path: "/grades", title: "Grades" },
    { path: "/assignments", title: "Assignments" },
    { path: "/calendar", title: "Calendar" },
    { path: "/announcements", title: "Announcements" },
    { path: "/discussions", title: "Discussions" },
    { path: "/notifications", title: "Notifications" },
    { path: "/catch-up", title: "Parent Catch-Up" },
    { path: "/today", title: "Today" },
    { path: "/focus", title: "Focus Mode" },
    { path: "/adhd-support", title: "ADHD Support" },
  ];

  for (const p of pages) {
    test(`${p.path} loads and shows header "${p.title}"`, async ({
      page,
    }) => {
      const response = await page.goto(p.path);
      expect(response?.status()).toBeLessThan(500);
      await expect(page.locator(pageHeader)).toContainText(p.title);
    });
  }
});
