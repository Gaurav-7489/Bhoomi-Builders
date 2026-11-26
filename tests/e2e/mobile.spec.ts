import { expect, test } from "@playwright/test";
import { skipIntro } from "./helpers";

test.beforeEach(async ({ page }) => skipIntro(page));

test("mobile menu opens, traps focus, closes with Escape and on navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "Main" })).toBeHidden();

  const toggle = page.getByRole("button", { name: "Menu" });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();

  const menu = page.getByRole("navigation", { name: "Mobile" });
  await expect(menu).toBeVisible();
  const closeBtn = page.getByRole("button", { name: "Close" });
  await expect(closeBtn).toHaveAttribute("aria-expanded", "true");
  await expect(menu.getByRole("link", { name: /Home/ })).toBeFocused();
  for (const name of ["Projects", "About", "Services", "Contact"]) {
    await expect(menu.getByRole("link", { name: new RegExp(name) })).toBeVisible();
  }

  // Shift+Tab from the first link wraps to the toggle, then back into the menu.
  await page.keyboard.press("Shift+Tab");
  await expect(closeBtn).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(menu.getByRole("link").last()).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(page.getByRole("button", { name: "Menu" })).toBeFocused();

  await page.getByRole("button", { name: "Menu" }).click();
  await page.getByRole("navigation", { name: "Mobile" }).getByRole("link", { name: /About/ }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole("navigation", { name: "Mobile" })).toBeHidden();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Rooted in/);
});

test("mobile layout has no horizontal overflow", async ({ page }) => {
  for (const path of ["/", "/projects", "/projects/ivory-court", "/about", "/services", "/contact"]) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
});
