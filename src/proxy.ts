import { NextResponse, type NextRequest } from "next/server";
import { projects } from "@/content/projects";

const known = new Set(projects.map((p) => p.slug));

/**
 * With Cache Components, a streamed page always starts with HTTP 200, so an
 * unknown case-study slug would only be a "soft" 404. Checking the slug here,
 * before rendering starts, gives crawlers and analytics a real 404 status.
 */
export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2];
  if (slug && !known.has(slug)) {
    return NextResponse.rewrite(new URL("/__not-found", request.url), { status: 404 });
  }
}

export const config = {
  matcher: "/projects/:slug",
};
