/**
 * Builds the per-project gallery images in public/projects/ from the raw
 * screenshots in screenshots/.
 *
 * The rule that matters here: NEVER upscale. An earlier pass stretched a
 * 1301px capture to the old 1600x1000 card convention, which added blur and no
 * detail. Now that the viewer lets people zoom to 1:1, stored resolution is the
 * ceiling on how sharp a zoom can ever look, so each image keeps its native
 * pixels and is only ever cropped or shrunk.
 *
 * Card thumbnails (`image` in projects.ts) stay 16:10 because the card and the
 * detail hero crop to fixed boxes. Gallery images keep their own aspect ratio
 * and record their dimensions in projects.ts, so the gallery grid can size each
 * cell to its image instead of cropping a phone screen into a letterbox.
 *
 * Run: node scripts/build-gallery-images.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const RAW = "screenshots";
const OUT = "public/projects";

/** Android status bar, cropped off every phone screenshot. */
const PHONE_STATUS_BAR = 58;

/** Quality is generous because these are the zoom target, not just thumbnails. */
const WEBP = { quality: 86 };

const agricycle = [
  ["Screenshot 2026-07-30 151616.png", "agricycle-home", "Home page hero and rotating banner"],
  ["Screenshot 2026-07-30 151655.png", "agricycle-mission", "What the company does, as a card row"],
  ["Screenshot 2026-07-30 151724.png", "agricycle-pellet", "Pellet fertilizer in the product catalogue"],
  ["Screenshot 2026-07-30 151738.png", "agricycle-liquid", "Liquid fertilizer, and the stakeholder logos"],
  ["Screenshot 2026-07-30 151815.png", "agricycle-news", "News index, rendered from the content tables"],
];

/**
 * Three of these were captured live from the running app; the order history
 * and admin dashboard sit behind a login, so those two are his own README
 * captures copied out of the ShopAPI repo. Same app, same design pass.
 */
const shopApi = [
  ["shopapi-home.jpg", "shop-api-home", "Home page: the shop's own editorial front"],
  ["shopapi-index.jpg", "shop-api-index", "The catalogue, filterable by category, price and search"],
  ["shopapi-product.jpg", "shop-api-product", "A product page, with derived rating and stock state"],
  ["shopapi-orders.jpg", "shop-api-orders", "Order history, with expandable line items"],
  ["shopapi-admin.jpg", "shop-api-admin", "Admin dashboard: revenue, orders and stock alerts"],
];

const intraBus = [
  ["photo_2026-07-30_15-59-55.jpg", "intra-bus-signin", "Conductor sign-in, by employee ID"],
  ["photo_2026-07-30_15-59-58.jpg", "intra-bus-home", "Shift dashboard with quick actions"],
  ["photo_2026-07-30_16-00-00.jpg", "intra-bus-start-shift", "Starting a shift: pick the bus and route"],
  ["photo_2026-07-30_16-00-03.jpg", "intra-bus-history", "Past shifts, each showing its reconciled state"],
  ["photo_2026-07-30_16-00-05.jpg", "intra-bus-active", "An active shift, with live revenue and transaction counts"],
  ["photo_2026-07-30_16-00-08.jpg", "intra-bus-fare", "Recording a fare against boarding and alighting stops"],
  ["photo_2026-07-30_16-00-10.jpg", "intra-bus-incident", "Reporting a breakdown, accident or dispute"],
];

const built = [];

async function emit(pipeline, slug, caption) {
  const file = path.join(OUT, `${slug}.webp`);
  await pipeline.webp(WEBP).toFile(file);
  const { width, height } = await sharp(file).metadata();
  built.push({ slug, caption, width, height });
  console.log(`  ${slug}.webp  ${width}x${height}`);
}

async function main() {
  await mkdir(OUT, { recursive: true });

  console.log("AgriCycle (native 1919px wide, untouched):");
  for (const [file, slug, caption] of agricycle) {
    await emit(sharp(path.join(RAW, file)), slug, caption);
  }

  console.log("ShopAPI (native, untouched):");
  for (const [file, slug, caption] of shopApi) {
    await emit(sharp(path.join(RAW, file)), slug, caption);
  }

  /* Card thumbnail for ShopAPI: the catalogue view, centre-cropped to 16:10 at
     its native size. The grid is centred with wide gutters, so the crop lands
     in whitespace. */
  const cardSrc = path.join(RAW, "shopapi-index.jpg");
  const meta = await sharp(cardSrc).metadata();
  const cropW = Math.round((meta.height * 16) / 10);
  await sharp(cardSrc)
    .extract({
      left: Math.round((meta.width - cropW) / 2),
      top: 0,
      width: cropW,
      height: meta.height,
    })
    .webp(WEBP)
    .toFile(path.join(OUT, "shop-api.webp"));
  const card = await sharp(path.join(OUT, "shop-api.webp")).metadata();
  console.log(`  shop-api.webp (card)  ${card.width}x${card.height}`);

  console.log("Intra Bus Mobile (status bar cropped):");
  for (const [file, slug, caption] of intraBus) {
    const src = sharp(path.join(RAW, file));
    const { width, height } = await src.metadata();
    await emit(
      sharp(path.join(RAW, file)).extract({
        left: 0,
        top: PHONE_STATUS_BAR,
        width,
        height: height - PHONE_STATUS_BAR,
      }),
      slug,
      caption,
    );
  }

  console.log("\nPaste into projects.ts:\n");
  for (const b of built) {
    console.log(
      `      { src: "/projects/${b.slug}.webp", width: ${b.width}, height: ${b.height}, caption: "${b.caption}" },`,
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
