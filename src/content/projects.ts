import type { Project } from "./types";

/* ===========================================================================
   Populated 2026-07-29 from the real repos under D:\code_projects.

   Written from each project's own README, package.json or pubspec.yaml —
   nothing here is invented. Still worth reading over: a README doesn't always
   capture what you'd want to say about a project on your portfolio.

   Card vs detail page:
     - `tech`        main languages/frameworks only — the row on the card
     - `stack`       the full grouped stack, detail page only
     - `overview`    longer prose, detail page only
     - `highlights`  bulleted capabilities, detail page only

   `availability` explains a missing link: "private" for private repos,
   "unpublished" for work not pushed yet. Both render a note on the detail
   page instead of a dead link. `availabilityNote` overrides that wording when
   the stock sentence would be misleading.

   ORDER MATTERS. `completeApps` is rendered in this order on /works and, via
   `featuredProjects`, on the home page. Projects that have a screenshot lead,
   because cards stretch to equal height per row: a text-only card sharing a
   row with an image card inherits its height and gains ~230px of dead space.
   With three image-bearing projects and a three-column grid, keeping them
   together fills the first row exactly and the text-only cards line up evenly
   underneath. Add a screenshot to a project and move it up into the first
   group.

   IMAGES: 1600x1000 webp in /public/projects/, set as `image`. The detail-page
   hero re-crops the same file to 16:9 by keeping the middle 900px of height,
   so nothing important may sit in the top or bottom 50px.
   =========================================================================== */

export const completeApps: Project[] = [
  /* --- Screenshots, so these lead the grid ------------------------------- */
  {
    slug: "shop-api",
    title: "ShopAPI",
    description:
      "Full-stack e-commerce platform: browsing, cart, wishlists, orders, reviews and a role-based admin dashboard.",
    tech: ["React", "TypeScript", "Express"],
    links: [{ kind: "github", href: "https://github.com/Laptopcorei7/ecommerce-website" }],
    featured: true,
    image: "/projects/shop-api.webp",
    gallery: [
      { src: "/projects/shop-api-home.webp", width: 1504, height: 812, caption: "Home page: the shop's own editorial front" },
      { src: "/projects/shop-api-index.webp", width: 1504, height: 812, caption: "The catalogue, filterable by category, price and search" },
      { src: "/projects/shop-api-product.webp", width: 1509, height: 815, caption: "A product page, with derived rating and stock state" },
      { src: "/projects/shop-api-orders.webp", width: 1509, height: 815, caption: "Order history, with expandable line items" },
      { src: "/projects/shop-api-admin.webp", width: 1509, height: 815, caption: "Admin dashboard: revenue, orders and stock alerts" },
    ],
    overview: [
      "A complete e-commerce application, front to back, built around a general store called Sundry that sells homeware, clothing, tools and books. Customers can browse and filter a catalogue of forty-three items, manage a cart and wishlist, check out, track orders and leave reviews.",
      "Behind a separate admin login sits a full operations dashboard: order and product management, sales analytics with revenue broken down by month, customer reports, and inventory alerts for low or out-of-stock items.",
      "The interface had a full design pass of its own. Type carries the branding rather than colour, the palette is limited to a warm off-white ground, a near-black and a single vermilion accent, and separation comes from hairline rules instead of shadows. Every text colour was checked against WCAG AA by walking the rendered DOM and computing contrast, rather than by eye.",
    ],
    highlights: [
      "Filter products by category, price range and search term",
      "Cart and wishlist, with one-step move between them",
      "Checkout, order history and customer-initiated cancellation",
      "Admin dashboard with revenue, order and user analytics",
      "Role-based access control with employee-ID admin verification",
      "Low and out-of-stock inventory alerting",
      "Text contrast verified against WCAG AA across the rendered interface",
    ],
    stack: [
      { title: "Frontend", items: ["React 18", "TypeScript", "Vite", "React Router v6"] },
      { title: "State", items: ["React Context (Auth, Cart, Wishlist, Toast)"] },
      { title: "Backend", items: ["Node.js", "Express"] },
      { title: "Database", items: ["MongoDB", "Mongoose"] },
      { title: "Auth", items: ["Session-based auth", "Role-based access control"] },
    ],
  },
  {
    slug: "intra-bus-mobile",
    title: "Intra Bus Mobile",
    description:
      "Conductor app for bus shift management and on-board ticketing, built to keep working when the signal drops.",
    tech: ["Flutter", "Riverpod"],
    links: [],
    availability: "private",
    featured: true,
    /* Three phone screens composited into one 16:10 landscape frame — a single
       portrait screenshot would crop to a thin band in the card. */
    image: "/projects/intra-bus-mobile.webp",
    /* Portrait phone screens. The grid sizes cells from these dimensions, so
       they render tall rather than cropped into a landscape band. */
    gallery: [
      { src: "/projects/intra-bus-signin.webp", width: 572, height: 1222, caption: "Conductor sign-in, by employee ID" },
      { src: "/projects/intra-bus-home.webp", width: 572, height: 1222, caption: "Shift dashboard with quick actions" },
      { src: "/projects/intra-bus-start-shift.webp", width: 572, height: 1222, caption: "Starting a shift: pick the bus and route" },
      { src: "/projects/intra-bus-active.webp", width: 572, height: 1222, caption: "An active shift, with live revenue and transaction counts" },
      { src: "/projects/intra-bus-fare.webp", width: 572, height: 1222, caption: "Recording a fare against boarding and alighting stops" },
      { src: "/projects/intra-bus-incident.webp", width: 572, height: 1222, caption: "Reporting a breakdown, accident or dispute" },
      { src: "/projects/intra-bus-history.webp", width: 572, height: 1222, caption: "Past shifts, each showing its reconciled state" },
    ],
    overview: [
      "The conductor-facing companion to Intra Bus Server. Conductors use it to manage their shift and issue tickets on board.",
      "Buses lose signal constantly on intercity routes, so the app is built offline-first: tickets are written to a local Hive store and reconciled with the server once connectivity returns, rather than failing at the point of sale.",
    ],
    highlights: [
      "Offline-first ticketing with local persistence",
      "Connectivity-aware sync back to the server",
      "Riverpod for state management",
      "Declarative routing with go_router",
      "Credentials in platform secure storage",
    ],
    stack: [
      { title: "Framework", items: ["Flutter", "Dart"] },
      { title: "State", items: ["flutter_riverpod"] },
      { title: "Networking", items: ["dio", "connectivity_plus"] },
      { title: "Storage", items: ["hive", "hive_flutter", "flutter_secure_storage"] },
      { title: "Routing", items: ["go_router"] },
    ],
  },
  {
    slug: "agricycle",
    title: "AgriCycle",
    description:
      "Site for a Ghanaian social enterprise turning agricultural waste into organic fertilizer.",
    tech: ["React", "Express", "SQLite"],
    links: [],
    availability: "private",
    /* Client work, so the stock "private repository" note would undersell why
       there is no link. It is not my code to publish. */
    availabilityNote:
      "This one was built for a client, so the repository stays private. The work belongs to them. I'm happy to walk you through the code and the decisions behind it on request.",
    featured: true,
    image: "/projects/agricycle.webp",
    gallery: [
      { src: "/projects/agricycle-home.webp", width: 1919, height: 974, caption: "Home page hero and rotating banner" },
      { src: "/projects/agricycle-mission.webp", width: 1919, height: 974, caption: "What the company does, as a card row" },
      { src: "/projects/agricycle-pellet.webp", width: 1919, height: 978, caption: "Pellet fertilizer in the product catalogue" },
      { src: "/projects/agricycle-liquid.webp", width: 1919, height: 969, caption: "Liquid fertilizer, and the stakeholder logos" },
      { src: "/projects/agricycle-news.webp", width: 1919, height: 973, caption: "News index, rendered from the content tables" },
    ],
    overview: [
      "A site for AgriCycle Ltd, a Ghanaian social enterprise that turns agricultural waste — plantain trees and their by-products — into organic fertilizer.",
      "The interesting part is the content layer. Almost every piece of copy on the site lives in JSON files that seed into SQLite, so the team can edit hero slides, products, team members, testimonials and news without touching code. Re-seeding is non-destructive: it rebuilds content tables but never drops subscriber or contact-form data.",
    ],
    highlights: [
      "JSON-driven content seeded into SQLite, editable without code changes",
      "Non-destructive re-seeding that preserves submitted data",
      "Build-time asset pipeline generating optimised images and a manifest",
      "Contact and newsletter capture persisted server-side",
    ],
    stack: [
      { title: "Frontend", items: ["React", "Vite", "CSS Modules"] },
      { title: "Backend", items: ["Node.js", "Express"] },
      { title: "Database", items: ["SQLite"] },
      { title: "Tooling", items: ["Custom asset pipeline"] },
    ],
  },

  /* --- No screenshot yet -------------------------------------------------- */
  {
    slug: "food-ninja",
    title: "Food Ninja",
    description:
      "Food delivery mobile app built with Flutter and BLoC, with secure token storage and multi-flavour builds.",
    tech: ["Flutter", "Dart", "BLoC"],
    links: [],
    availability: "unpublished",
    overview: [
      "The mobile client for Food Ninja, and what I'm actively building right now. It talks to the Food Ninja API for everything from sign-up through to live delivery tracking.",
      "State is managed with BLoC, keeping business logic out of the widget tree. Auth tokens live in platform secure storage rather than plain preferences, and the project is set up with separate development, staging and production flavours.",
    ],
    highlights: [
      "BLoC state management, isolating logic from UI",
      "Tokens held in platform secure storage",
      "Separate development, staging and production flavours",
      "Camera and gallery upload with runtime permission handling",
    ],
    stack: [
      { title: "Framework", items: ["Flutter", "Dart"] },
      { title: "State", items: ["bloc", "flutter_bloc"] },
      { title: "Storage", items: ["flutter_secure_storage", "shared_preferences"] },
      { title: "Networking", items: ["http"] },
      { title: "Device", items: ["image_picker", "permission_handler"] },
    ],
  },
  {
    slug: "intra-bus-server",
    title: "Intra Bus Server",
    description:
      "REST API for bus ticketing and fleet management, with refresh-token auth and a full integration test suite.",
    tech: ["Node.js", "Express", "MongoDB"],
    links: [],
    availability: "private",
    overview: [
      "The backend for a bus ticketing and fleet management platform. It handles ticketing, scheduling and fleet data for an operator running scheduled intercity routes.",
      "This is the most thoroughly engineered service I've built. Auth is JWT with rotating refresh tokens, every endpoint validates its input before it reaches a handler, and the whole surface is covered by integration tests that run against an in-memory MongoDB instance rather than mocks.",
    ],
    highlights: [
      "JWT authentication with rotating refresh tokens",
      "Schema validation on every request with Joi",
      "Structured JSON logging via Pino, with per-request correlation",
      "Helmet, CORS and rate limiting applied at the edge",
      "Integration tests against an in-memory MongoDB, not mocks",
    ],
    stack: [
      { title: "Runtime", items: ["Node.js", "ESM"] },
      { title: "Framework", items: ["Express 5"] },
      { title: "Database", items: ["MongoDB", "Mongoose"] },
      { title: "Auth", items: ["JWT", "Refresh tokens", "bcrypt", "crypto"] },
      { title: "Validation", items: ["Joi"] },
      { title: "Logging", items: ["Pino", "pino-http"] },
      { title: "Security", items: ["Helmet", "CORS", "express-rate-limit"] },
      { title: "Testing", items: ["Vitest", "Supertest", "mongodb-memory-server"] },
    ],
  },
  {
    slug: "food-ninja-api",
    title: "Food Ninja API",
    description:
      "Backend for the Food Ninja app — auth, image uploads, real-time order updates, and SMS and email notifications.",
    tech: ["Express", "MongoDB", "Socket.io"],
    links: [{ kind: "github", href: "https://github.com/Laptopcorei7/food-ninja-server" }],
    overview: [
      "The service behind the Food Ninja mobile app. It covers the full order lifecycle — accounts, restaurant and menu data, order placement, and delivery tracking.",
      "Order state is pushed to clients over WebSockets rather than polled, so a customer watching their delivery sees changes the moment they happen. Notifications go out over both SMS and email depending on how urgent the update is.",
    ],
    highlights: [
      "Real-time order tracking pushed over WebSockets",
      "SMS notifications through Twilio",
      "Transactional email for receipts and account flows",
      "Image upload handling for menu and profile media",
      "JWT auth with bcrypt-hashed credentials",
    ],
    stack: [
      { title: "Framework", items: ["Express", "Node.js"] },
      { title: "Database", items: ["MongoDB", "Mongoose"] },
      { title: "Real-time", items: ["Socket.io"] },
      { title: "Auth", items: ["JWT", "bcrypt"] },
      { title: "Notifications", items: ["Twilio", "Nodemailer"] },
      { title: "Uploads", items: ["Multer"] },
      { title: "Tooling", items: ["Morgan", "CORS", "dotenv"] },
    ],
  },
];

export const smallProjects: Project[] = [
  {
    slug: "ecommerce-api",
    title: "E-Commerce API",
    description:
      "Commerce backend with cookie auth, input validation, rate limiting and scheduled background jobs.",
    tech: ["Express", "MongoDB"],
    links: [{ kind: "github", href: "https://github.com/Laptopcorei7/ecommerce-api" }],
    overview: [
      "A standalone commerce API covering catalogue, accounts and orders. Written as a focused backend exercise before the full-stack ShopAPI build.",
    ],
    highlights: [
      "Cookie-based sessions with bcrypt-hashed credentials",
      "Field validation with validator",
      "Rate limiting and Helmet security headers",
      "Scheduled background jobs via node-cron",
    ],
    stack: [
      { title: "Framework", items: ["Express", "Node.js"] },
      { title: "Database", items: ["MongoDB", "Mongoose"] },
      { title: "Auth", items: ["bcrypt", "cookie-parser"] },
      { title: "Security", items: ["Helmet", "express-rate-limit", "validator"] },
      { title: "Jobs", items: ["node-cron"] },
    ],
  },
  {
    slug: "nasa-project",
    title: "NASA Project",
    description: "Mission control dashboard with a Node API and a separate React client.",
    tech: ["Node.js", "React"],
    links: [],
    availability: "unpublished",
    overview: [
      "A mission control dashboard for scheduling launches against known exoplanet targets, split into an Express API and a React client.",
    ],
    stack: [
      { title: "Backend", items: ["Node.js", "Express"] },
      { title: "Frontend", items: ["React"] },
    ],
  },
];

/**
 * Featured projects shown in the home page `#projects` section.
 *
 * All three carry a screenshot, so the home grid is one clean row with no
 * ragged card heights. Because the image-bearing projects lead `completeApps`,
 * this is just the first three of that list; marking a fourth as `featured`
 * would not displace them.
 *
 * The APIs are one click away on /works, which is where a visitor who wants the
 * backend work goes next.
 */
export const featuredProjects: Project[] = completeApps
  .filter((project) => project.featured)
  .slice(0, 3);

/** Every project, for detail-page routing. */
export const allProjects: Project[] = [...completeApps, ...smallProjects];

export function getProjectBySlug(slug: string): Project | undefined {
  return allProjects.find((project) => project.slug === slug);
}
