import { contact, faq, site } from "@/content/site";
import { services } from "@/content/pages";
import { plainText } from "@/lib/text";

/** Canonical origin. Set NEXT_PUBLIC_SITE_URL=https://bhoomi.builders in production. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const absoluteUrl = (path = "/") => `${siteUrl}${path === "/" ? "" : path}`;

/** Search phrases people use for this kind of business. Used in metadata and llms.txt. */
export const keywords = [
  "builders in Thrissur",
  "construction company Thrissur",
  "house construction Thrissur",
  "home builders Kerala",
  "commercial construction Thrissur",
  "renovation contractors Thrissur",
  "architectural design and planning Kerala",
  "turnkey house construction Kerala",
  "Bhoomi Builders",
  "VNV Bhoomi Builders LLP",
];

const businessId = `${siteUrl}/#business`;

/**
 * schema.org description of the business (GeneralContractor is a LocalBusiness).
 * Only facts from the fact sheet: no ratings, coordinates or opening hours,
 * because those aren't confirmed yet.
 */
export function businessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "GeneralContractor",
        "@id": businessId,
        name: site.displayName,
        legalName: site.legalName,
        alternateName: "Bhoomi",
        description: site.description,
        url: siteUrl,
        email: contact.email,
        telephone: "+918590450090",
        foundingDate: "2025-06-07",
        image: absoluteUrl("/images/projects/residence-exterior-two-cover.jpg"),
        logo: absoluteUrl("/icon.svg"),
        address: {
          "@type": "PostalAddress",
          streetAddress: "Building No. 40/258/C, Karuthende Parambil, Methala",
          addressLocality: "Thrissur",
          addressRegion: "Kerala",
          postalCode: "680664",
          addressCountry: "IN",
        },
        areaServed: { "@type": "State", name: "Kerala" },
        identifier: { "@type": "PropertyValue", propertyID: "LLPIN", value: site.llpin },
        founder: [
          "Vishnu Kumbalath Salim",
          "Nisanth Sadanandan",
          "Vishnu Eranezhath Vengali Jayaprakash",
        ].map((name) => ({ "@type": "Person", name, jobTitle: "Designated Partner" })),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Construction services",
          itemListElement: services.map((s) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: s.title,
              description: s.body,
              url: absoluteUrl(`/services#${s.slug}`),
              provider: { "@id": businessId },
              areaServed: { "@type": "State", name: "Kerala" },
            },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: site.displayName,
        inLanguage: "en-IN",
        publisher: { "@id": businessId },
      },
    ],
  };
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: plainText(t.name),
      item: absoluteUrl(t.path),
    })),
  };
}

/** Builds per-page metadata with a canonical URL and matching social cards. */
export function pageMetadata({
  title,
  description,
  path,
  image = "/images/projects/residence-exterior-two-cover.jpg",
  noindex = false,
}: {
  title?: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
}) {
  const fullTitle = title ? `${title} — ${site.displayName}` : undefined;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website" as const,
      url: path,
      siteName: site.displayName,
      locale: "en_IN",
      ...(fullTitle ? { title: fullTitle } : {}),
      description,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image" as const,
      ...(fullTitle ? { title: fullTitle } : {}),
      description,
      images: [image],
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
