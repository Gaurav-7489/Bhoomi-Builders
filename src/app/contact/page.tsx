import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/forms/ContactForm";
import { ArrowUpRightIcon } from "@/components/icons";
import { Reveal, RevealWords } from "@/components/motion/Reveal";
import { PageHero } from "@/components/PageHero";
import { FaqSection } from "@/components/sections";
import { contactPage } from "@/content/pages";
import { contact, socials } from "@/content/site";
import styles from "./contact.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Contact Builders in Thrissur",
  description:
    "Contact Bhoomi Builders in Methala, Thrissur, Kerala. Call or WhatsApp +91 85904 50090 or email hello@bhoomi.builders to discuss your house, commercial building or renovation.",
  path: "/contact",
  image: "/images/pages/contact.jpg",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Contact", path: "/contact" }])} />
      <PageHero
        title={contactPage.hero.title}
        intro={contactPage.hero.intro}
        image={contactPage.hero.image}
        meta="Thrissur, Kerala"
        scrollCue
      />
      <div className="sheet">
        <section className="section container" aria-label="Contact details and form">
          <div className="grid">
            <Reveal className={styles.details}>
              <dl className={styles.list}>
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  </dd>
                </div>
                <div>
                  <dt>Phone</dt>
                  <dd>
                    <a href={contact.phoneHref}>{contact.phone}</a>
                  </dd>
                </div>
                <div>
                  <dt>WhatsApp</dt>
                  <dd>
                    <a href={contact.whatsappHref} target="_blank" rel="noopener noreferrer">
                      Message us on WhatsApp
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </dd>
                </div>
                <div>
                  <dt>Registered office</dt>
                  <dd>
                    <a href={contact.mapUrl} target="_blank" rel="noopener noreferrer">
                      {contact.address.map((l) => (
                        <span key={l}>{l}</span>
                      ))}
                      <span className="sr-only"> (opens map in a new tab)</span>
                    </a>
                  </dd>
                </div>
                <div>
                  <dt>Visits</dt>
                  <dd className={styles.hours}>{contact.hours}</dd>
                </div>
                {socials.length > 0 && (
                <div>
                  <dt>Follow</dt>
                  <dd className={styles.socials}>
                    {socials.map((s) => (
                      <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer">
                        {s.label} <ArrowUpRightIcon size={13} />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ))}
                  </dd>
                </div>
                )}
              </dl>
            </Reveal>

            <div className={styles.formCol}>
              <RevealWords text={contactPage.formTitle} className={`h-md ${styles.formTitle}`} />
              <Reveal delay={0.1}>
                <ContactForm />
              </Reveal>
            </div>
          </div>
        </section>
        <FaqSection />
      </div>
    </>
  );
}
