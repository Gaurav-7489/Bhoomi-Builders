import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const pages: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/services", priority: 0.9 },
    { path: "/contact", priority: 0.9 },
    { path: "/about", priority: 0.7 },
    { path: "/projects", priority: 0.6 },
  ];
  return [
    ...pages.map((p) => ({ url: `${siteUrl}${p.path}`, lastModified, priority: p.priority })),
    // Sample projects are noindex, so they're left out until real ones exist.
    ...projects
      .filter((p) => !p.sample)
      .map((p) => ({ url: `${siteUrl}/projects/${p.slug}`, lastModified, priority: 0.6 })),
  ];
}
