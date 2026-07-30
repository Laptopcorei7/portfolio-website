import type { ContactMethod, Profile, Quote, SocialLink } from "./types";

/**
 * Canonical origin for this site. Absolute URLs in metadata, the sitemap and
 * robots.txt are all built from it.
 *
 * Set NEXT_PUBLIC_SITE_URL in your host's environment once you have a domain —
 * on Vercel, Project Settings → Environment Variables. Until then it falls back
 * to localhost, which is correct for development and harmless in a preview.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

/* ===========================================================================
   Real content supplied 2026-07-29: name, role, tagline, email, socials.

   Still PLACEHOLDER and awaiting your input:
     - `bio` paragraphs
     - `quote`
     - `funFacts`
   Those are marked inline below.
   =========================================================================== */

export const profile: Profile = {
  name: "Hananiah Kweku Buabeng Asare",
  // The full name is 28 characters — too wide for the mobile nav beside the
  // menu button — so the header and footer mark use this shorter form.
  shortName: "Hananiah Asare",
  headline: [
    { text: "Hananiah is a " },
    { text: "backend", accent: true },
    { text: " and " },
    { text: "mobile developer", accent: true },
  ],
  tagline: "God is the ultimate Architect",
  email: "buabengasare56@gmail.com",
  footerBio: "Backend & Mobile Developer",
  currentlyWorkingOn: "FoodNinja",
  bio: [
    "Hello, I'm Hananiah!",
    "I'm a backend and mobile developer based in Kumasi, Ghana. Most of what I build is two halves of the same system — a REST API in Node and Express, and the Flutter app that consumes it. Sometimes it's just the API, sometimes a web app instead.",
    "The problems I take on tend to be operational ones: a food delivery platform, a ticketing and fleet system for a bus operator. Right now I'm building Food Ninja, my most recent delivery app. I'm open to junior backend or mobile roles, and to freelance work.",
  ],
};

export const quote: Quote = {
  text: "But seek first the kingdom of God and his righteousness, and all these things will be added to you.",
  author: "Matthew 6:33",
};

/** `inRail` links show in the fixed vertical rail on the left of every page. */
export const socials: SocialLink[] = [
  {
    platform: "github",
    handle: "@laptopCoreI7",
    href: "https://github.com/laptopCoreI7",
    inRail: true,
  },
  {
    platform: "x",
    handle: "@LukeOnReal_",
    href: "https://x.com/LukeOnReal_",
    inRail: true,
  },
  // No href: a Discord username isn't a URL, so this renders as plain text.
  { platform: "discord", handle: "laptopcorei7" },
];

/** The "Message me here" box on the home and contacts pages. */
export const contactMethods: ContactMethod[] = [
  { platform: "discord", label: "laptopcorei7" },
  { platform: "email", label: profile.email, href: `mailto:${profile.email}` },
];

export const contactsBlurb =
  "I'm interested in freelance opportunities. However, if you have other request or question, don't hesitate to contact me";

/**
 * Text wrapped in *asterisks* renders in white against the grey, matching the
 * keyword emphasis in the mockup. Everything outside the markers is body text.
 */
export const funFacts: string[] = [
  "I love *music*",
  "My favorite movie is *Ready Player One*",
  "I love *gaming*",
  "My favorite game is *Farming Simulator 25*",
];
