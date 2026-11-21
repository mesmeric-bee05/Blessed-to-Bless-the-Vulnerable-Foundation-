import type { NextConfig } from "next";

/**
 * Security headers are defined here so every response — HTML, JSON and static
 * assets — carries the same baseline. CSP notes and the upgrade path to a
 * nonce-based policy are documented in docs/SECURITY.md.
 */
const isProd = process.env.NODE_ENV === "production";

const contentSecurityPolicy = [
  "default-src 'self'",
  // Next.js injects a small inline bootstrap. All first-party code is bundled,
  // and the site loads no third-party scripts. See docs/SECURITY.md (ADR-004).
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co",
  "media-src 'self'",
  "manifest-src 'self'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isProd ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(self), usb=(), interest-cohort=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  ...(isProd
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  // The cloud preview is served from a per-session hostname. Keep the dev
  // origin allow-list explicit rather than opening it to every host.
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    ...(process.env.PREVIEW_HOSTNAME ? [process.env.PREVIEW_HOSTNAME] : []),
  ],
  experimental: {
    // Keep client bundles lean on the low-bandwidth networks most BBVF donors use.
    optimizePackageImports: ["zod"],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "private, no-store" }],
      },
    ];
  },
};

export default nextConfig;
