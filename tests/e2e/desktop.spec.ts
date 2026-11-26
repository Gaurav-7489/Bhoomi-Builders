import { expect, test } from "@playwright/test";
import { skipIntro } from "./helpers";

test.beforeEach(async ({ page }) => skipIntro(page));

test("desktop navigation reaches every page and marks the current one", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Main" });
  const header = page.locator("header");
  for (const [name, path, heading] of [
    ["Projects", "/projects", /Work that/],
    ["About", "/about", /Rooted in/],
    ["Services", "/services", /Made with/],
  ] as const) {
    await nav.getByRole("link", { name }).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
    await expect(nav.getByRole("link", { name })).toHaveAttribute("aria-current", "page");
  }
  await header.getByRole("link", { name: "Contact" }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Let’s talk/);
  await header.getByRole("link", { name: /home/ }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("button", { name: "Menu" })).toBeHidden();
});

test("FAQ: first answer open, toggles by mouse and keyboard", async ({ page }) => {
  await page.goto("/about");
  const faq = page.getByRole("region", { name: "Frequently asked questions" });
  const buttons = faq.getByRole("button");
  await expect(buttons).toHaveCount(5);

  const first = buttons.nth(0);
  await first.scrollIntoViewIfNeeded();
  await expect(first).toHaveAttribute("aria-expanded", "true");
  await expect(faq.getByText(/Full interior design, space planning/)).toBeVisible();

  await first.click();
  await expect(first).toHaveAttribute("aria-expanded", "false");
  await expect(faq.getByText(/Full interior design, space planning/)).toBeHidden();

  const second = buttons.nth(1);
  await second.focus();
  await expect(second).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(second).toHaveAttribute("aria-expanded", "true");
  await expect(faq.getByText(/We have a way of working/)).toBeVisible();
  await page.keyboard.press("Space");
  await expect(second).toHaveAttribute("aria-expanded", "false");

  await page.keyboard.press("Tab");
  await expect(buttons.nth(2)).toBeFocused();
});

test("home services preview shows all four, first open", async ({ page }) => {
  await page.goto("/");
  const section = page.getByRole("region", { name: "Services" });
  const triggers = section.getByRole("button");
  await expect(triggers).toHaveCount(4);
  await expect(triggers.nth(0)).toHaveAttribute("aria-expanded", "true");
  await triggers.nth(1).scrollIntoViewIfNeeded();
  await triggers.nth(1).click();
  await expect(triggers.nth(1)).toHaveAttribute("aria-expanded", "true");
  await expect(section.getByRole("img", { name: /floor-to-ceiling glazing/i })).toBeVisible();
});

test("reduced motion: no preloader and all content readable", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator(".preloader")).toBeHidden();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < height; y += 600) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(800);
  const words = page.locator("[data-reveal]");
  const transforms = await words.evaluateAll((els) =>
    els.filter((e) => {
      const t = getComputedStyle(e).transform;
      return t !== "none" && Math.abs(new DOMMatrix(t).m42) > 1;
    }).length,
  );
  expect(transforms).toBe(0);
  await context.close();
});
