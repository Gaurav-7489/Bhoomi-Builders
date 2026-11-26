/**
 * Site-wide content. Edit brand details, contact information, navigation,
 * social links and shared copy here — every page reads from this file.
 *
 * Text wrapped in _underscores_ inside headings renders in italic.
 *
 * Facts here come from the Bhoomi Builders fact sheet (25 Nov 2026) and the
 * LLP Agreement. Don't add claims (numbers, awards, timelines, warranties)
 * until the owners have confirmed them.
 */

export const site = {
  /** Short wordmark shown in the logo and preloader. */
  name: "Bhoomi",
  /** Public-facing business name. */
  displayName: "Bhoomi Builders",
  /** Registered legal name (LLPIN ACO-9606). */
  legalName: "VNV Bhoomi Builders LLP",
  llpin: "ACO-9606",
  descriptor: "Design & Construction",
  description:
    "Bhoomi Builders (VNV Bhoomi Builders LLP) is a design and construction company in Thrissur, Kerala, building homes and commercial buildings, taking on renovations, and offering design and planning.",
  founded: 2025,
  copyrightYear: 2026,
};

const whatsappNumber = "918590450090";

export const contact = {
  email: "hello@bhoomi.builders",
  phone: "+91 85904 50090",
  phoneHref: "tel:+918590450090",
  whatsappHref: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Hello Bhoomi Builders, I'd like to discuss a project.",
  )}`,
  address: [
    "Building No. 40/258/C, Karuthende Parambil",
    "Methala, Thrissur 680664",
    "Kerala, India",
  ],
  hours: "Call or WhatsApp us to arrange a meeting.",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Methala%2C+Thrissur%2C+Kerala+680664",
};

export const nav = [
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
] as const;

/**
 * Social profiles. Empty until real accounts exist; add entries like
 * { label: "Instagram", href: "https://www.instagram.com/<handle>/" }.
 * The "Follow" sections hide themselves while this list is empty.
 */
export const socials: { label: string; href: string }[] = [];

export const faq = {
  label: "FAQ",
  title: "Questions, _answered_",
  items: [
    {
      q: "What does Bhoomi Builders do?",
      a: "We build new homes and commercial buildings, take on renovation work, and offer architectural design and planning. You can come to us for one of these or for the whole project, from first drawings to construction.",
    },
    {
      q: "Can you design my building as well as build it?",
      a: "Yes. Design and planning is one of our services, so the same company can prepare your plans and then build them.",
    },
    {
      q: "Do you take on renovations?",
      a: "Yes. We handle renovations, extensions, repairs and alterations to existing homes and buildings.",
    },
    {
      q: "How much will my project cost?",
      a: "Every project is priced on its own. Tell us about your plot or building and what you have in mind, and we’ll talk you through the next step towards an estimate.",
    },
    {
      q: "Who is behind Bhoomi Builders?",
      a: "Bhoomi Builders is the trading name of VNV Bhoomi Builders LLP (LLPIN ACO-9606), a limited liability partnership registered in Kerala and led by three designated partners. Our registered office is in Methala, Thrissur.",
    },
  ],
};

export const cta = {
  title: "Let’s build your _next_ project",
  body: "Tell us about your plot, home or building and what you’d like to do with it. Call, WhatsApp or send us a message to start the conversation.",
  action: { label: "Start a project", href: "/contact" },
  image: { src: "/images/home/cta.jpg", alt: "Dark-clad modern house at dusk with a warm-lit timber entrance" },
};
