import { contact } from "@/content/site";
import styles from "./WhatsAppButton.module.css";

/** Floating "chat on WhatsApp" button, shown on every page. */
export function WhatsAppButton() {
  return (
    <a
      href={contact.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.button}
      aria-label="Chat with us on WhatsApp (opens in a new tab)"
      title="Chat on WhatsApp"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path d="M4 20l1.3-3.9A8 8 0 1 1 8 18.8L4 20z" strokeLinejoin="round" />
        <path d="M9.2 8.6c.2-.4.5-.5.8-.5h.4l.8 1.8-.6.8c.4.9 1.2 1.7 2.1 2.1l.8-.6 1.8.8v.4c0 .3-.1.6-.5.8-.6.4-1.4.5-2.2.2a6.6 6.6 0 0 1-3.6-3.6c-.3-.8-.2-1.6.2-2.2z" fill="currentColor" stroke="none" />
      </svg>
    </a>
  );
}
