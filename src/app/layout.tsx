import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { site } from "@/content/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.displayName} — ${site.descriptor} in Thrissur, Kerala`,
    template: `%s — ${site.displayName}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.displayName,
    images: [{ url: "/images/home/hero.jpg", width: 2000, height: 1333 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#262324",
};

/**
 * Runs before paint: the preloader plays once per browser session, and once
 * it has finished, hero titles on later pages animate without waiting for it.
 */
const introScript = `(function(){try{var d=document.documentElement;if(sessionStorage.getItem('bhoomi-intro')){d.dataset.intro='done';return}sessionStorage.setItem('bhoomi-intro','1');setTimeout(function(){d.dataset.intro='done'},1900)}catch(e){document.documentElement.dataset.intro='done'}})();`;

const SITE_LETTERS = [...site.name, "®"];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important}.preloader{display:none}`}</style>
        </noscript>
      </head>
      <body>
        <div className="preloader" aria-hidden="true">
          <span className="preloader__word">
            {SITE_LETTERS.map((ch, i) => (
              <span key={i} style={{ "--i": i } as React.CSSProperties}>
                {ch}
              </span>
            ))}
          </span>
        </div>
        <MotionProvider>
          <Header />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
        </MotionProvider>
      </body>
    </html>
  );
}
