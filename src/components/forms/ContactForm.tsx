"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useRef } from "react";
import { contactSchema } from "@/lib/forms";
import { ArrowIcon } from "../icons";
import { EASE_OUT } from "../motion/Reveal";
import { useFormSubmit } from "./useFormSubmit";
import styles from "./ContactForm.module.css";

const FIELDS = [
  { name: "name", label: "Name", type: "text", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email", inputMode: "email" },
  { name: "phone", label: "Phone Number", type: "tel", autoComplete: "tel", inputMode: "tel" },
] as const;

export function ContactForm() {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const { status, error, fieldErrors, submit, reset, clearField } = useFormSubmit("/api/contact", contactSchema);
  const pending = status === "pending";

  const fieldProps = (name: string) => ({
    id: `${id}-${name}`,
    name,
    required: true,
    "aria-required": true as const,
    "aria-invalid": fieldErrors[name] ? (true as const) : undefined,
    "aria-describedby": fieldErrors[name] ? `${id}-${name}-error` : undefined,
    onChange: () => clearField(name),
    readOnly: pending,
  });

  return (
    <div className={styles.wrap}>
      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <motion.div
            key="success"
            ref={(el) => el?.focus()}
            tabIndex={-1}
            className={styles.success}
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
          >
            <p className={styles.successTitle}>
              Thank you — your message is <em>with us</em>.
            </p>
            <p className={styles.successBody}>
              We read every enquiry personally and will reply within two working days.
            </p>
            <button type="button" className="button" onClick={reset}>
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            className={styles.form}
            noValidate
            aria-busy={pending}
            aria-describedby={`${id}-status`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const fd = new FormData(form);
              const values = Object.fromEntries(fd.entries());
              const ok = await submit(values);
              if (ok) {
                form.reset();
              } else {
                // Move focus to the first invalid field so keyboard users land on it.
                requestAnimationFrame(() =>
                  form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
                );
              }
            }}
          >
            {FIELDS.map((f) => (
              <div key={f.name} className={styles.field} data-invalid={fieldErrors[f.name] ? "" : undefined}>
                <label htmlFor={`${id}-${f.name}`} className={styles.label}>
                  {f.label} <span aria-hidden>*</span>
                </label>
                <input
                  {...fieldProps(f.name)}
                  type={f.type}
                  autoComplete={f.autoComplete}
                  inputMode={"inputMode" in f ? f.inputMode : undefined}
                  className={styles.input}
                />
                {fieldErrors[f.name] && (
                  <p id={`${id}-${f.name}-error`} className={styles.error}>
                    {fieldErrors[f.name]}
                  </p>
                )}
              </div>
            ))}

            <div className={styles.field} data-invalid={fieldErrors.message ? "" : undefined}>
              <label htmlFor={`${id}-message`} className={styles.label}>
                Message <span aria-hidden>*</span>
              </label>
              <textarea {...fieldProps("message")} rows={5} className={`${styles.input} ${styles.textarea}`} />
              {fieldErrors.message && (
                <p id={`${id}-message-error`} className={styles.error}>
                  {fieldErrors.message}
                </p>
              )}
            </div>

            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              className={styles.honeypot}
              aria-hidden="true"
            />

            <div className={styles.actions}>
              <button type="submit" className="button button--solid" disabled={pending}>
                {pending ? "Sending…" : "Submit"}
                {pending ? <span className={styles.spinner} aria-hidden /> : <ArrowIcon size={18} />}
              </button>
              <p id={`${id}-status`} className={styles.status} role="status" aria-live="polite" data-state={status}>
                {status === "pending" && "Sending your message…"}
                {status === "error" && error}
                {status === "idle" && "All fields are required."}
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
