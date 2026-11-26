/**
 * Case studies. Each entry becomes a page at /projects/[slug].
 * Add, remove or reorder entries here; the projects grid, the home page
 * feature, the sitemap and the "next project" link all follow this list.
 *
 * Images live in /public/images/projects. Gallery layout: the 1st and 4th
 * images run full width, the 2nd and 3rd sit side by side.
 *
 * The four entries below are SAMPLE projects with stock photos, kept at the
 * owners' request and labelled on the site as samples. Replace them with real
 * Bhoomi Builders projects (and drop `sample: true`) before launch.
 */

export type ProjectImage = { src: string; alt: string };

export type Project = {
  slug: string;
  /** true = illustrative placeholder, not a real Bhoomi Builders project. */
  sample?: boolean;
  title: string;
  summary: string;
  description: string[];
  year: string;
  status: "Completed" | "In progress";
  location: string;
  size: string;
  client: string;
  sector: string;
  cover: ProjectImage;
  gallery: ProjectImage[];
};

export const projects: Project[] = [
  {
    slug: "oakroom-residence",
    sample: true,
    title: "Oakroom Residence",
    summary: "A family home rebuilt around oak, lime plaster and morning light.",
    description: [
      "Oakroom Residence began as a dark, divided 1990s bungalow. We opened the ground floor into one long room under exposed timber beams, then set arched steel windows deep into new lime-plastered walls so the light arrives softly and moves through the day.",
      "Floors, joinery and the kitchen island are cut from the same white oak, which ties the rooms together without making them feel uniform. Upstairs, bedrooms are quieter and lower — linen, wool and stone, with storage built into every wall.",
    ],
    year: "2025",
    status: "Completed",
    location: "Bengaluru, India",
    size: "420 m²",
    client: "Private client",
    sector: "Residential",
    cover: {
      src: "/images/projects/oakroom-residence-cover.jpg",
      alt: "White living room with exposed timber beams, arched black windows and a stone fireplace",
    },
    gallery: [
      { src: "/images/projects/oakroom-residence-1.jpg", alt: "Formal living room with coffered ceiling and built-in shelving either side of the fireplace" },
      { src: "/images/projects/oakroom-residence-2.jpg", alt: "Open stair hall leading to a bright lounge with pale sofas" },
      { src: "/images/projects/oakroom-residence-3.jpg", alt: "Calm bedroom with a full-width quilted headboard wall and white linen" },
      { src: "/images/projects/oakroom-residence-4.jpg", alt: "Kitchen with white cabinetry, black pendant lights and an island with stools" },
    ],
  },
  {
    slug: "elhmart-penthouse",
    sample: true,
    title: "Elhmart Penthouse",
    summary: "A city apartment in charcoal, marble and black joinery.",
    description: [
      "For a client who works late and entertains often, the Elhmart Penthouse is designed for evening. Bedroom walls are washed in deep charcoal, joinery is matte black, and lighting is layered low and warm so every room softens after dark.",
      "A marble-topped kitchen anchors the open plan, while the bedroom suite sits behind a run of full-height joinery that hides wardrobes, a bar and the service core. Brass is used sparingly, only where hands touch.",
    ],
    year: "2025",
    status: "Completed",
    location: "Mumbai, India",
    size: "310 m²",
    client: "Elhmart Holdings",
    sector: "Residential — Penthouse",
    cover: {
      src: "/images/projects/elhmart-penthouse-cover.jpg",
      alt: "Moody bedroom with charcoal walls, a sculptural chandelier and pale bedding",
    },
    gallery: [
      { src: "/images/projects/elhmart-penthouse-1.jpg", alt: "Dark kitchen with matte black cabinetry, marble island and warm under-cabinet light" },
      { src: "/images/projects/elhmart-penthouse-2.jpg", alt: "Minimal room with a black sofa, white chest of drawers and a black floor lamp" },
      { src: "/images/projects/elhmart-penthouse-4.jpg", alt: "Entry console with a round mirror, rattan pendant and potted plants" },
      { src: "/images/projects/elhmart-penthouse-3.jpg", alt: "Charcoal sectional sofa against a reclaimed timber wall" },
    ],
  },
  {
    slug: "vellum-apartment",
    sample: true,
    title: "Vellum Apartment",
    summary: "A compact apartment made generous with colour and clever joinery.",
    description: [
      "Vellum is 145 square metres that needed to work like twice that. We redrew the plan around a single storage spine that holds a fold-away desk, pantry and guest bedding, freeing the rest of the apartment for light and furniture people actually use.",
      "Colour does the rest: deep teal in the living room, terracotta in the dining nook and washed sage in the bedroom give each zone its own mood without a single new wall. Phase two — the main bathroom and balcony — is on site now.",
    ],
    year: "2026",
    status: "In progress",
    location: "Pune, India",
    size: "145 m²",
    client: "Private client",
    sector: "Residential — Apartment",
    cover: {
      src: "/images/projects/vellum-apartment-cover.jpg",
      alt: "Living room with a teal wall, tan leather sofa and framed black-and-white prints",
    },
    gallery: [
      { src: "/images/projects/vellum-apartment-2.jpg", alt: "Dining nook with green velvet chairs around a round table" },
      { src: "/images/projects/vellum-apartment-1.jpg", alt: "Sunny living area with an orange lounge chair, plants and a round mirror" },
      { src: "/images/projects/vellum-apartment-3.jpg", alt: "Bedroom with sage bedding, rattan details and trailing plants" },
      { src: "/images/projects/vellum-apartment-4.jpg", alt: "Floating timber shelves styled with ceramics, plants and a framed print" },
    ],
  },
  {
    slug: "ivory-court",
    sample: true,
    title: "Ivory Court",
    summary: "Shared spaces for a twelve-home building, in limestone and linen.",
    description: [
      "Ivory Court’s owners asked for a lobby and residents’ lounge that felt like an extension of their homes rather than a hotel. We kept the palette tight — honed limestone, bleached oak and natural linen — and scaled the furniture to domestic proportions.",
      "The lounge is arranged as a series of small rooms within one: a library corner, a long table for shared dinners, and low sofas by the garden glazing. Durable finishes were chosen to age well under daily use.",
    ],
    year: "2024",
    status: "Completed",
    location: "Hyderabad, India",
    size: "680 m²",
    client: "Ivory Court Residents’ Association",
    sector: "Multi-residential",
    cover: {
      src: "/images/projects/ivory-court-cover.jpg",
      alt: "Light residents’ lounge with cream sofas, round coffee table and a large wall clock",
    },
    gallery: [
      { src: "/images/projects/ivory-court-1.jpg", alt: "Grey and white lounge with layered rugs and black accent table" },
      { src: "/images/projects/ivory-court-2.jpg", alt: "Guest suite with blue-grey walls and a wooden headboard" },
      { src: "/images/projects/ivory-court-3.jpg", alt: "Living room with a brown sofa, glass coffee table and black-and-white artwork" },
      { src: "/images/projects/ivory-court-4.jpg", alt: "Bright lounge and dining area with large windows and neutral furniture" },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}
