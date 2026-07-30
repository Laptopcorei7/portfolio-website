import { ImageResponse } from "next/og";

/**
 * Generated favicon, drawn to match the LogoMark used in the header and footer:
 * a bordered square with two offset accent blocks.
 *
 * Pure shapes, no text — so this needs no embedded font and cannot fail at
 * build time the way a text-based ImageResponse can.
 */

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#282C33",
          border: "2px solid #ABB2BF",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 6,
            left: 6,
            width: 9,
            height: 9,
            background: "#C778DD",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 15,
            left: 15,
            width: 9,
            height: 9,
            background: "#C778DD",
          }}
        />
      </div>
    ),
    size,
  );
}
