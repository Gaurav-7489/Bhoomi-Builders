import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/projects", "/about", "/services", "/contact"];
  return [
    ...pages.map((p) => ({ url: `${base}${p}` })),
    ...projects.map((p) => ({ url: `${base}/projects/${p.slug}` })),
  ];
}
