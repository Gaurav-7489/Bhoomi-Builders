import { z } from "zod";

/** Shared by the client forms (instant feedback) and the API routes (authoritative). */

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120, "That name is a little long."),
  email: z.email("Please enter a valid email address.").trim().max(200),
  phone: z
    .string()
    .trim()
    .min(1, "Please enter a phone number.")
    .regex(/^\+?[0-9 ()\-.]{7,20}$/, "Please enter a valid phone number."),
  message: z
    .string()
    .trim()
    .min(10, "Please tell us a little more (at least 10 characters).")
    .max(5000, "Please keep your message under 5,000 characters."),
});

export const newsletterSchema = z.object({
  email: z.email("Please enter a valid email address.").trim().max(200),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type FieldErrors = Partial<Record<string, string>>;

export function toFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

/** Response body returned by /api/contact and /api/newsletter. */
export type FormResponse =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: FieldErrors };
