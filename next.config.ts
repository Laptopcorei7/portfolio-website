import type { NextConfig } from "next";

/**
 * Security headers.
 *
 * The site loads no third-party scripts, styles, fonts or images — next/font
 * downloads Fira Code at build time and serves it from /_next/static — so
 * everything can be locked to 'self'. github.com and x.com appear only as link
 * targets, which CSP does not restrict.
 *
 * `'unsafe-inline'` is present for scripts and styles, and that is a real
 * weakening worth understanding rather than glossing over:
 *   - Next.js inlines the hydration payload as a <script> tag. Removing
 *     'unsafe-inline' requires per-request nonces, which forces every page to
 *     render dynamically and gives up the static prerendering this site is
 *     built on. For a site with no user-generated content that is a bad trade.
 *   - Even with 'unsafe-inline', the policy still blocks the main injection
 *     vector: loading script from an external origin.
 *
 * If a third-party script is ever added (analytics, embeds), extend script-src
 * with that exact origin rather than opening it up.
 */
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "connect-src 'self'",
      // Belt and braces alongside X-Frame-Options: blocks clickjacking in
      // browsers that honour CSP level 2+.
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
  // Stops the browser second-guessing declared MIME types, which is how a
  // served file can be coerced into executing as script.
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  // Full URL to ourselves, origin only cross-site, nothing over plain http.
  // Keeps deep links out of third-party referrer logs.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Nothing here needs these; deny by default so a future dependency cannot
  // quietly start asking.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  // Don't advertise the framework in a response header.
  poweredByHeader: false,

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
