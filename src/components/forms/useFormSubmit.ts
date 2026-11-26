"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { z } from "zod";
import { toFieldErrors, type FieldErrors, type FormResponse } from "@/lib/forms";

export type Status = "idle" | "pending" | "success" | "error";

/**
 * Validates on the client for instant feedback, posts JSON to an API route,
 * and only reports success when the server confirms delivery.
 */
export function useFormSubmit<T extends z.ZodType>(endpoint: string, schema: T) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const inFlight = useRef(false);

  // Routes are kept alive (hidden) between navigations; don't greet a returning
  // visitor with a stale success/error message.
  useLayoutEffect(() => {
    return () => {
      setStatus((s) => (s === "pending" ? s : "idle"));
      setError(null);
      setFieldErrors({});
    };
  }, []);

  async function submit(values: Record<string, unknown>): Promise<boolean> {
    if (inFlight.current) return false;
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(toFieldErrors(parsed.error));
      setError("Please check the highlighted fields.");
      setStatus("error");
      return false;
    }

    inFlight.current = true;
    setStatus("pending");
    setError(null);
    setFieldErrors({});
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...(parsed.data as object), website: values.website ?? "" }),
      });
      const data = (await res.json().catch(() => null)) as FormResponse | null;
      if (res.ok && data?.ok) {
        setStatus("success");
        return true;
      }
      setFieldErrors(data && !data.ok ? (data.fieldErrors ?? {}) : {});
      setError(
        data && !data.ok ? data.error : "Something went wrong sending your message. Please try again.",
      );
      setStatus("error");
      return false;
    } catch {
      setError("We couldn’t reach the server. Check your connection and try again.");
      setStatus("error");
      return false;
    } finally {
      inFlight.current = false;
    }
  }

  function reset() {
    setStatus("idle");
    setError(null);
    setFieldErrors({});
  }

  function clearField(name: string) {
    if (fieldErrors[name]) setFieldErrors((f) => ({ ...f, [name]: undefined }));
  }

  return { status, error, fieldErrors, submit, reset, clearField };
}
