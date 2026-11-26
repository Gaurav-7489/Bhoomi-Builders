import { expect, test } from "@playwright/test";
import { projects, skipIntro } from "./helpers";

test.beforeEach(async ({ page }) => skipIntro(page));

test("home renders sections in order", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Building on");
  const order = await page.locator("main section").evaluateAll((els) =>
    els.map((e) => e.getAttribute("aria-label") ?? e.getAttribute("aria-labelledby") ?? ""),
  );
  const labels = order.filter(Boolean);
  const expected = [
    "About us",
    "Featured projects",
    "Services",
    "Frequently asked questions",
    "Start a project",
  ];
  const positions = expected.map((l) => labels.indexOf(l));
  expect(positions.every((p) => p >= 0)).toBe(true);
  expect([...positions].sort((a, b) => a - b)).toEqual(positions);
  await expect(page.locator("footer")).toBeVisible();
});

for (const p of projects) {
  test(`case study /projects/${p.slug} loads directly and on refresh`, async ({ page }) => {
    const res = await page.goto(`/projects/${p.slug}`);
    expect(res?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(p.title);
    for (const label of ["Date", "Status", "Location", "Size", "Client", "Sector"]) {
      await expect(page.locator("dt", { hasText: label })).toBeVisible();
    }
    await expect(page.getByRole("region", { name: "Photo gallery" }).locator("img")).toHaveCount(4);
    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(p.title);
    const next = page.getByRole("region", { name: "Next project" }).getByRole("link");
    await expect(next).toHaveAttribute("href", /\/projects\/[a-z-]+$/);
  });
}

test("unknown project returns 404", async ({ page }) => {
  const res = await page.goto("/projects/does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("doesn’t");
});

test("project cards open their case studies", async ({ page }) => {
  await page.goto("/projects");
  const cards = page.getByRole("region", { name: "All projects" }).getByRole("link");
  await expect(cards).toHaveCount(4);
  for (const p of projects) {
    await page.goto("/projects");
    await page.getByRole("region", { name: "All projects" }).getByRole("link", { name: new RegExp(p.title) }).click();
    await expect(page).toHaveURL(new RegExp(`/projects/${p.slug}$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(p.title);
  }
});

test("calls to action and footer links are wired", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "View all projects" }).click();
  await expect(page).toHaveURL(/\/projects$/);

  await page.goto("/");
  await page.getByRole("link", { name: "All services" }).click();
  await expect(page).toHaveURL(/\/services$/);
  const serviceList = page.getByRole("region", { name: "Our services" });
  await expect(serviceList.getByRole("heading", { level: 2 })).toHaveCount(4);
  for (const name of [
    "House Construction",
    "Commercial Construction",
    "Renovation & Remodelling",
    "Design & Planning",
  ]) {
    await expect(serviceList.getByRole("heading", { level: 2, name })).toBeVisible();
  }

  await page.goto("/");
  await page.getByRole("link", { name: "About us" }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole("heading", { name: /people behind/i })).toBeVisible();

  await page.getByRole("link", { name: "Start a project" }).click();
  await expect(page).toHaveURL(/\/contact$/);

  const footer = page.locator("footer");
  const whatsapp = footer.getByRole("link", { name: /WhatsApp/ });
  await expect(whatsapp).toHaveAttribute("target", "_blank");
  await expect(whatsapp).toHaveAttribute("href", /^https:\/\/wa\.me\/918590450090/);
  await expect(footer.getByRole("link", { name: "+91 85904 50090" })).toHaveAttribute("href", "tel:+918590450090");
  await footer.getByRole("link", { name: "Services", exact: true }).click();
  await expect(page).toHaveURL(/\/services$/);
});
