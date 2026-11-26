import "server-only";
import type { z } from "zod";
import { deliver } from "./deliver";
import { toFieldErrors, type FormResponse } from "./forms";

const json = (body: FormResponse, status: number, headers?: HeadersInit) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

/** Largest request body accepted (bytes). A long enquiry is well under this. */
const MAX_BODY_BYTES = 16 * 1024;

/**
 * Simple per-IP rate limit: at most RATE_LIMIT submissions per window.
 * In-memory, so it's per server instance — enough to blunt bursts of spam;
 * add a shared store (e.g. Upstash) if abuse becomes a real problem.
 */
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
  }
  return recent.length > RATE_LIMIT;
}

/** Rejects posts made from other websites (cross-site form abuse). */
function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true; // Some privacy tools strip it; other checks still apply.
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

/**
 * Shared POST handler: parse → honeypot → validate → deliver.
 * Success is only reported after the configured destination accepts the data.
 */
export async function handleFormPost<T extends z.ZodType>(
  request: Request,
  schema: T,
  destination: "contact" | "newsletter",
) {
  if (!sameOrigin(request)) {
    return json({ ok: false, error: "Submission blocked." }, 403);
  }
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json({ ok: false, error: "We couldn’t read that submission. Please try again." }, 415);
  }
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return json({ ok: false, error: "That message is too long to send." }, 413);
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(`${destination}:${ip}`)) {
    return json(
      { ok: false, error: "Too many attempts. Please wait a few minutes, or call or WhatsApp us instead." },
      429,
      { "Retry-After": "600" },
    );
  }

  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) {
      return json({ ok: false, error: "That message is too long to send." }, 413);
    }
    body = JSON.parse(text);
  } catch {
    return json({ ok: false, error: "We couldn’t read that submission. Please try again." }, 400);
  }

  // Honeypot: real visitors never see or fill the "website" field.
  if (body && typeof body === "object" && "website" in body && (body as { website?: unknown }).website) {
    return json({ ok: false, error: "Submission blocked." }, 400);
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return json(
      { ok: false, error: "Please check the highlighted fields.", fieldErrors: toFieldErrors(parsed.error) },
      422,
    );
  }

  const result = await deliver(destination, parsed.data as Record<string, unknown>);
  if (result.ok) return json({ ok: true }, 200);

  if (result.reason === "not_configured") {
    console.error(`[forms] No endpoint configured for "${destination}". See .env.example.`);
    return json(
      { ok: false, error: "This form isn’t connected yet. Please email us directly while we fix it." },
      503,
    );
  }
  return json(
    { ok: false, error: "Something went wrong sending your message. Please try again in a moment." },
    502,
  );
}
