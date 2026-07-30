/**
 * Builds the project card/hero images from raw screenshots.
 *
 *   node scripts/build-project-images.mjs
 *
 * Output is 1600x1000 (16:10) because that is the card aspect. The detail-page
 * hero re-crops the same file to 16:9, which keeps the middle 900px of height —
 * so nothing important may sit in the top/bottom 50px.
 *
 * Phone screenshots are portrait and cannot be used directly: object-cover would
 * crop them to a thin horizontal band. They get composited three-up instead.
 */
import sharp from "sharp";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");
/** Raw screenshots, gitignored. Processed output is committed. */
const SRC = path.join(ROOT, "screenshots");
const OUT = path.join(ROOT, "public", "projects");

const W = 1600;
const H = 1000;
const BG = "#282c33"; // site background, so the composite sits flush on the page

/** Rounded-corner mask applied to each phone screenshot. */
async function rounded(buf, w, h, r) {
  const mask = Buffer.from(
    `<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${r}" ry="${r}"/></svg>`,
  );
  return sharp(buf)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
}

async function agricycle() {
  const src = path.join(SRC, "Screenshot 2026-07-30 151616.png");
  const { width, height } = await sharp(src).metadata();

  // Narrow the 1.97 aspect to 16:10 by cropping width, centred. Height is kept
  // in full so the nav bar and the headline both survive.
  const cropW = Math.round(height * (W / H));
  const left = Math.round((width - cropW) / 2);

  await sharp(src)
    .extract({ left, top: 0, width: cropW, height })
    .resize(W, H, { fit: "fill" })
    .webp({ quality: 88 })
    .toFile(path.join(OUT, "agricycle.webp"));

  console.log(`agricycle.webp  <- crop ${cropW}x${height} at x=${left}`);
}

async function intraBusMobile() {
  // Three screens that tell the story: run a shift, record a fare, review history.
  const screens = [
    "photo_2026-07-30_16-00-05.jpg", // active shift dashboard
    "photo_2026-07-30_16-00-08.jpg", // record fare
    "photo_2026-07-30_16-00-03.jpg", // shift history
  ];

  const STATUS_BAR = 58; // crop off the Android status bar (clock, notif icons, battery)
  const PHONE_H = 820; // < 900 so the 16:9 hero crop never clips a phone
  const GAP = 64;

  const prepared = [];
  for (const file of screens) {
    const src = path.join(SRC, file);
    const meta = await sharp(src).metadata();
    const cropped = await sharp(src)
      .extract({
        left: 0,
        top: STATUS_BAR,
        width: meta.width,
        height: meta.height - STATUS_BAR,
      })
      .toBuffer();

    const scale = PHONE_H / (meta.height - STATUS_BAR);
    const phoneW = Math.round(meta.width * scale);
    const resized = await sharp(cropped).resize(phoneW, PHONE_H).png().toBuffer();
    prepared.push({ buf: await rounded(resized, phoneW, PHONE_H, 22), w: phoneW });
  }

  const totalW = prepared.reduce((s, p) => s + p.w, 0) + GAP * (prepared.length - 1);
  let x = Math.round((W - totalW) / 2);
  const top = Math.round((H - PHONE_H) / 2);

  const layers = prepared.map((p) => {
    const layer = { input: p.buf, left: x, top };
    x += p.w + GAP;
    return layer;
  });

  await sharp({
    create: { width: W, height: H, channels: 3, background: BG },
  })
    .composite(layers)
    .webp({ quality: 90 })
    .toFile(path.join(OUT, "intra-bus-mobile.webp"));

  console.log(
    `intra-bus-mobile.webp  <- 3 phones, each ${prepared[0].w}x${PHONE_H}, total ${totalW}px wide`,
  );
}

(async () => {
  await agricycle();
  await intraBusMobile();
})();
