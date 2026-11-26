import type { Page } from "@playwright/test";

export const MOCK = `http://127.0.0.1:${process.env.MOCK_PORT ?? 4010}`;

export const projects = [
  { slug: "oakroom-residence", title: "Oakroom Residence" },
  { slug: "elhmart-penthouse", title: "Elhmart Penthouse" },
  { slug: "vellum-apartment", title: "Vellum Apartment" },
  { slug: "ivory-court", title: "Ivory Court" },
];

/** Skip the once-per-session preloader so tests start on an idle page. */
export async function skipIntro(page: Page) {
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem("bhoomi-intro", "1");
    } catch {}
  });
}

export async function submissionsFor(email: string) {
  const res = await fetch(`${MOCK}/submissions`);
  const all = (await res.json()) as { endpoint: string; body: Record<string, unknown> }[];
  return all.filter((s) => s.body.email === email);
}

export const uniqueEmail = (tag: string) =>
  `${tag}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@example.com`;
