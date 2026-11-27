import { test, expect } from "@playwright/test";
import { skipIntro } from "./helpers";

test.beforeEach(async ({ page }) => skipIntro(page));

test("scroll bands load and native scroll reverses", async ({ page }) => {
  await page.goto("/");
  const bands = page.locator(".pin img");
  expect(await bands.count()).toBeGreaterThan(0);
  for (const image of await bands.all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await page.mouse.wheel(0, 700);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  await page.mouse.wheel(0, -1500);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});

test("hover does not toggle accordion; click toggles twice", async ({ page }) => {
  await page.goto("/");
  const row = page.getByRole("region", { name: "Services" }).getByRole("button").nth(1);
  await row.scrollIntoViewIfNeeded();
  await row.hover();
  await page.waitForTimeout(350);
  await expect(row).toHaveAttribute("aria-expanded", "false");
  await row.click();
  await expect(row).toHaveAttribute("aria-expanded", "true");
  await row.click();
  await expect(row).toHaveAttribute("aria-expanded", "false");
});
