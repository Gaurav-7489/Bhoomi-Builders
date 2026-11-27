/**
 * Page-level copy and imagery for Home, Projects, About, Services and Contact.
 * Text wrapped in _underscores_ inside headings renders in italic.
 *
 * Photos are still Unsplash placeholders (see IMAGE_CREDITS.md). Replace them
 * with Bhoomi Builders' own photography before launch.
 */

export const services = [
  {
    slug: "house-construction",
    title: "House Construction",
    body: "New homes and villas built from the ground up, including turnkey projects that take you from approved plans to a finished house.",
    image: { src: "/images/pages/about.jpg", alt: "Contemporary house with timber cladding and a glazed entrance" },
  },
  {
    slug: "commercial-construction",
    title: "Commercial Construction",
    body: "Shops, offices and other commercial buildings, with the civil and building work planned and carried out together.",
    image: { src: "/images/home/band-1.jpg", alt: "Open interior with floor-to-ceiling glazing and pale furniture" },
  },
  {
    slug: "renovation",
    title: "Renovation & Remodelling",
    body: "Renovations, extensions, repairs and alterations that improve an existing home or building and make better use of its space.",
    image: { src: "/images/services/renovation-guidance.jpg", alt: "Freshly renovated white kitchen with marble worktops and brass pendants" },
  },
  {
    slug: "design-and-planning",
    title: "Design & Planning",
    body: "Architectural design, planning and consultancy that turn your plot and your requirements into drawings ready to build.",
    image: { src: "/images/services/space-planning.jpg", alt: "Open-plan dining room with a timber table set beside large windows" },
  },
];

export const home = {
  hero: {
    title: ["Building on", "solid _ground_"],
    intro:
      "Bhoomi Builders designs and builds homes, commercial buildings and renovations, from first drawings to construction. Based in Thrissur, Kerala.",
    image: {
      src: "/images/home/hero.jpg",
      alt: "Modern timber and glass house glowing at dusk beneath a large tree",
    },
  },
  intro: {
    label: "Who we are",
    statement:
      "We set out to deliver sustainable, high-quality construction — combining thoughtful design, eco-friendly practices and careful craftsmanship, so that every project holds its value for years to come.",
    caption: "VNV Bhoomi Builders LLP · Thrissur, Kerala · Est. 2025",
    link: { label: "About us", href: "/about" },
    imageLarge: { src: "/images/home/intro-large.jpg", alt: "Long living room with a clerestory window, low sofas and terracotta ottomans" },
    imageSmall: { src: "/images/home/intro-small.jpg", alt: "Mustard armchair beside a black-and-white abstract print" },
  },
  /** Words in the scrolling band below the intro. */
  marquee: ["House Construction", "Commercial Buildings", "Renovation", "Design & Planning"],
  bands: [
    { src: "/images/home/band-1.jpg", alt: "Open living space with floor-to-ceiling glazing and pale furniture" },
    { src: "/images/home/band-2.jpg", alt: "Glass-walled stair overlooking a swimming pool and the sea" },
    { src: "/images/home/band-3.jpg", alt: "Sage-green living room with rattan pendant lights, framed prints and a patterned rug" },
  ],
  projects: {
    label: "Sample work",
    title: "The kind of spaces we _build_",
    link: { label: "View all projects", href: "/projects" },
  },
  services: {
    label: "Services",
    title: "From first drawing to _finished_ building",
    link: { label: "All services", href: "/services" },
  },
};

/** Shown wherever sample (not real) projects appear. Remove once real work is added. */
export const sampleProjectsNote =
  "These are sample projects that illustrate the kind of work we do. They are not Bhoomi Builders projects. Our own completed work will be added here soon.";

export const projectsPage = {
  hero: {
    title: ["Work that", "_settles_ in"],
    intro: "Homes and spaces designed for everyday living, solid materials and good light.",
    image: { src: "/images/pages/projects.jpg", alt: "Sunlit living room with a grid of framed photographs above a tan leather sofa" },
  },
};

export const aboutPage = {
  hero: {
    title: ["Rooted in", "_craft_"],
    intro: "A design and construction company in Thrissur, Kerala, registered as VNV Bhoomi Builders LLP.",
    image: { src: "/images/pages/about.jpg", alt: "Contemporary house with timber cladding and a glazed entrance" },
  },
  statement:
    "Bhoomi Builders was set up to deliver sustainable, high-quality construction: thoughtful design, eco-friendly practices and careful craftsmanship, with lasting value and satisfied clients at the end of every project.",
  story: [
    {
      heading: "Design and construction, together",
      body: "We offer architectural design and planning alongside construction, so your drawings and the building work can come from the same company. Whether it’s a new house, a commercial building or a renovation, you can bring us in at the start or at the stage you need.",
      image: { src: "/images/pages/about-1.jpg", alt: "Sage-green living room with a mirror, plants and a low timber sideboard" },
    },
    {
      heading: "Built to last, built responsibly",
      body: "Our aim is construction that is sustainable as well as well made — buildings designed with care, built with attention to detail, and meant to serve the people who use them for many years.",
      image: { src: "/images/pages/about-2.jpg", alt: "Living room with a tan leather sofa, sage feature wall and glass pendant lights" },
    },
  ],
  storyImage: { src: "/images/pages/about-3.jpg", alt: "Loft living area with exposed brick, a grey sofa and a long kitchen counter" },
  team: {
    label: "Partners",
    title: "The people behind _Bhoomi_",
    members: [
      {
        name: "Vishnu Kumbalath Salim",
        role: "Designated Partner",
        image: { src: "/images/team/member-1.jpg", alt: "Portrait of Vishnu Kumbalath Salim, smiling, in sunglasses and a navy blazer" },
      },
      {
        name: "Nisanth Sadanandan",
        role: "Designated Partner",
        image: { src: "/images/team/member-2.jpg", alt: "Portrait of Nisanth Sadanandan, smiling, in sunglasses and a navy blazer" },
      },
      {
        name: "Vishnu Eranezhath Vengali Jayaprakash",
        role: "Designated Partner",
        image: { src: "/images/team/member-3.jpg", alt: "Portrait of Vishnu Eranezhath Vengali Jayaprakash in sunglasses and a navy blazer" },
      },
    ],
  },
};

export const servicesPage = {
  hero: {
    title: ["Made with", "_care_"],
    intro: "Four ways we can help — on their own, or together as one complete project.",
    image: { src: "/images/pages/services.jpg", alt: "Sunlit living room with a rose lounge chair, green artwork and open shelving" },
  },
};

export const contactPage = {
  hero: {
    title: ["Let’s talk about", "your _project_"],
    intro: "Tell us about your plot, home or building, and what you’d like to build or change.",
    image: { src: "/images/pages/contact.jpg", alt: "Bedroom with an upholstered headboard, bedside lamps and soft daylight" },
  },
  formTitle: "Tell us about your project",
};
