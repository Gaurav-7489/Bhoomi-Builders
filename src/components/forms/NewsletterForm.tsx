"use client";

import { useId } from "react";
import { newsletterSchema } from "@/lib/forms";
import { ArrowIcon } from "../icons";
import { useFormSubmit } from "./useFormSubmit";
import styles from "./NewsletterForm.module.css";

export function NewsletterForm() {
  const id = useId();
  const { status, error, fieldErrors, submit, clearField } = useFormSubmit("/api/newsletter", newsletterSchema);
  const pending = status === "pending";
  const emailError = fieldErrors.email;

  return (
    <form
      className={styles.form}
      noValidate
      aria-busy={pending}
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const fd = new FormData(form);
        const ok = await submit({ email: fd.get("email"), website: fd.get("website") });
        if (ok) form.reset();
      }}
    >
      <label htmlFor={`${id}-email`} className="sr-only">
        Email address
      </label>
      <div className={styles.row} data-invalid={emailError ? "" : undefined}>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="Your email address"
          required
          aria-required="true"
          aria-invalid={emailError ? true : undefined}
          aria-describedby={`${id}-status`}
          disabled={pending}
          onChange={() => clearField("email")}
          className={styles.input}
        />
        <button type="submit" className={styles.submit} disabled={pending} aria-label="Subscribe">
          {pending ? <span className={styles.spinner} aria-hidden /> : <ArrowIcon />}
        </button>
      </div>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className={styles.honeypot}
        aria-hidden="true"
      />
      <p id={`${id}-status`} className={styles.status} role="status" aria-live="polite" data-state={status}>
        {status === "pending" && "Subscribing…"}
        {status === "success" && "Thank you — you’re on the list."}
        {status === "error" && (emailError ?? error)}
        {status === "idle" && "Occasional notes on new work and materials. No spam."}
      </p>
    </form>
  );
}
