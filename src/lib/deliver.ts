import "server-only";

type Destination = "contact" | "newsletter";

const ENV_KEYS: Record<Destination, string> = {
  contact: "CONTACT_WEBHOOK_URL",
  newsletter: "NEWSLETTER_WEBHOOK_URL",
};

export type DeliveryResult =
  | { ok: true }
  | { ok: false; reason: "not_configured" | "rejected" | "unreachable"; status?: number };

/**
 * Forwards a validated submission as JSON to the endpoint configured for it
 * (Formspree, Zapier/Make webhook, your own API, or the local mock).
 * Resolves ok only when the destination answers with a 2xx status.
 */
export async function deliver(
  destination: Destination,
  payload: Record<string, unknown>,
): Promise<DeliveryResult> {
  const url = process.env[ENV_KEYS[destination]];
  if (!url) return { ok: false, reason: "not_configured" };

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const secret = process.env.FORMS_WEBHOOK_SECRET;
  if (secret) headers.Authorization = `Bearer ${secret}`;

  const timeoutMs = Number(process.env.FORMS_TIMEOUT_MS ?? 10000);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        type: destination,
        ...payload,
        submittedAt: new Date().toISOString(),
        source: process.env.NEXT_PUBLIC_SITE_URL ?? "website",
      }),
      signal: AbortSignal.timeout(timeoutMs),
      cache: "no-store",
    });
    if (res.ok) return { ok: true };
    console.error(`[forms] ${destination} endpoint rejected submission: HTTP ${res.status}`);
    return { ok: false, reason: "rejected", status: res.status };
  } catch (err) {
    console.error(`[forms] ${destination} endpoint unreachable:`, err instanceof Error ? err.message : err);
    return { ok: false, reason: "unreachable" };
  }
}
