import "server-only";
import type { z } from "zod";
import { deliver } from "./deliver";
import { toFieldErrors, type FormResponse } from "./forms";

const json = (body: FormResponse, status: number) => Response.json(body, { status });

/**
 * Shared POST handler: parse → honeypot → validate → deliver.
 * Success is only reported after the configured destination accepts the data.
 */
export async function handleFormPost<T extends z.ZodType>(
  request: Request,
  schema: T,
  destination: "contact" | "newsletter",
) {
  let body: unknown;
  try {
    body = await request.json();
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
