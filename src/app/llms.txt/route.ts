import { siteUrl } from "@/lib/seo";

export function GET() {
  const body = `# Bhoomi Builders\n\n> Kerala-registered construction business based in Thrissur, India.\n\nLegal name: VNV Bhoomi Builders LLP. Legal commencement: 2025.\n\n## Official pages\n- [Home](${siteUrl}/)\n- [About](${siteUrl}/about)\n- [Services and enquiries](${siteUrl}/services)\n- [Contact](${siteUrl}/contact)\n\nConfirm current service availability, project scope, pricing and timelines directly with the business. Illustrative designs are not evidence of completed construction.\n`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
