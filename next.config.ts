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
const isDev = process.env.NODE_ENV !== "production";

/**
 * React's development build calls eval() for debugging features such as
 * rebuilding a callstack that crossed the server/client boundary, so `next dev`
 * needs 'unsafe-eval' or the console fills with "eval() is not supported in
 * this environment". The production build never calls eval(), so the shipped
 * policy stays without it.
 */
const scriptSrc = isDev
  ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
  : "script-src 'self' 'unsafe-inline'";

/**
 * `frame-ancestors 'none'` and `X-Frame-Options: DENY` block framing outright,
 * including framing the site in itself. That is what we want in production, but
 * locally it also blocks the easiest way to check a responsive layout: loading
 * the page in a narrow same-origin iframe, where media queries resolve against
 * the frame's width rather than the window's. Development allows 'self' only,
 * so a page on any other origin still cannot frame the dev server.
 */
const frameAncestors = isDev ? "frame-ancestors 'self'" : "frame-ancestors 'none'";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      scriptSrc,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "connect-src 'self'",
      // Belt and braces alongside X-Frame-Options: blocks clickjacking in
      // browsers that honour CSP level 2+.
      frameAncestors,
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
  // Stops the browser second-guessing declared MIME types, which is how a
  // served file can be coerced into executing as script.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Older browsers that ignore frame-ancestors. SAMEORIGIN in development for
  // the same responsive-testing reason described above.
  { key: "X-Frame-Options", value: isDev ? "SAMEORIGIN" : "DENY" },
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
