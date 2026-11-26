import Link from "next/link";
import { services } from "@/content/pages";
import { contact, nav, site, socials } from "@/content/site";
import { NewsletterForm } from "./forms/NewsletterForm";
import { ArrowUpRightIcon } from "./icons";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.cols} container`}>
        <div className={styles.col}>
          <h2 className={styles.heading}>Contact</h2>
          <address className={styles.address}>
            {contact.address.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
          <a href={`mailto:${contact.email}`} className={styles.link}>
            {contact.email}
          </a>
          <a href={contact.phoneHref} className={styles.link}>
            {contact.phone}
          </a>
          <a href={contact.whatsappHref} target="_blank" rel="noopener noreferrer" className={styles.link}>
            WhatsApp
            <ArrowUpRightIcon size={15} />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>

        <nav className={styles.col} aria-label="Footer">
          <h2 className={styles.heading}>Nav</h2>
          <ul className={styles.list}>
            <li>
              <Link href="/" className={styles.link}>
                Home
              </Link>
            </li>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.link}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {socials.length > 0 ? (
          <div className={styles.col}>
            <h2 className={styles.heading}>Socials</h2>
            <ul className={styles.list}>
              {socials.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className={styles.link}>
                    {s.label}
                    <ArrowUpRightIcon size={15} />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className={styles.col}>
            <h2 className={styles.heading}>Work</h2>
            <ul className={styles.list}>
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services#${s.slug}`} className={styles.link}>
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={`${styles.col} ${styles.news}`}>
          <h2 className={styles.heading}>Sign up for our newsletter</h2>
          <NewsletterForm />
        </div>
      </div>

      <p className={`${styles.wordmark} container`} aria-hidden="true">
        {site.name.toUpperCase()}
        <sup className={styles.wordmarkReg}>®</sup>
      </p>

      <div className={`${styles.bottom} container`}>
        <p>
          {site.displayName} © {site.copyrightYear}
        </p>
        <p className={styles.descriptor}>
          {site.legalName} · LLPIN {site.llpin}
        </p>
        <a href="#main" className={styles.top}>
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
