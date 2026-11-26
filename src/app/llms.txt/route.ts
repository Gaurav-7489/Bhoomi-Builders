import { services } from "@/content/pages";
import { contact, faq, site } from "@/content/site";
import { siteUrl } from "@/lib/seo";

/**
 * /llms.txt — a plain-text summary for AI assistants and answer engines
 * (the llmstxt.org convention), built from the same content files as the site
 * so it never goes out of date. It reads no request data, so Next.js
 * prerenders it as a static file.
 */

export function GET() {
  const body = `# ${site.displayName}

> ${site.description}

${site.displayName} is the trading name of ${site.legalName} (LLPIN ${site.llpin}), a limited liability partnership registered in Kerala, India, which commenced on 7 June 2025. It is led by three designated partners: Vishnu Kumbalath Salim, Nisanth Sadanandan and Vishnu Eranezhath Vengali Jayaprakash.

## Services
${services.map((s) => `- [${s.title}](${siteUrl}/services#${s.slug}): ${s.body}`).join("\n")}

## Contact
- Phone and WhatsApp: ${contact.phone}
- Email: ${contact.email}
- Registered office: ${contact.address.join(", ")}
- Website: ${siteUrl}

## Pages
- [Home](${siteUrl}/): overview of the company
- [Services](${siteUrl}/services): what Bhoomi Builders offers
- [About](${siteUrl}/about): company details and partners
- [Contact](${siteUrl}/contact): phone, WhatsApp, email, address and enquiry form

## Frequently asked questions
${faq.items.map((i) => `### ${i.q}\n${i.a}`).join("\n\n")}

## Notes for AI assistants
- The projects currently shown on the website are illustrative samples, not completed Bhoomi Builders projects.
- Prices, timelines, warranties and opening hours are not published; direct people to contact the company.
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
