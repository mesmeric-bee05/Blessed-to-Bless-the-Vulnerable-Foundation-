import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { site } from "@/content/site";
import { absoluteUrl } from "@/lib/site-url";
import { JsonLd } from "@/components/ui/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  title: {
    default: `${site.name} — Dignity, care and opportunity in Nairobi`,
    template: `%s — ${site.shortName}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  category: "nonprofit",
  formatDetection: { telephone: false, address: false, email: false },
  alternates: { canonical: absoluteUrl("/") },
  robots: site.status === "live"
    ? { index: true, follow: true }
    : { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: absoluteUrl("/"),
    siteName: site.name,
    title: `${site.name} — Dignity, care and opportunity in Nairobi`,
    description: site.description,
    images: [{ url: "/og.jpg", width: 1248, height: 832, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Dignity, care and opportunity in Nairobi`,
    description: site.description,
    images: ["/og.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f1e6" },
    { media: "(prefers-color-scheme: dark)", color: "#0c1a15" },
  ],
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-KE" className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
      </body>
    </html>
  );
}
