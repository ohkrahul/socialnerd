import { ImageResponse } from "next/og";
import { siteMeta } from "@/lib/content";

/**
 * The share card, generated rather than stored.
 *
 * The previous OG image was `meetup-01.jpg` — an Instagram poster for a
 * cancelled event, on a blue-purple gradient, i.e. the one colour family the
 * brand forbids. Generating the card from the palette means it can never drift
 * off-brand again, and there is no asset to keep in sync with the copy.
 */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${siteMeta.name} — screen-free conversations in ${siteMeta.city}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#2A3B2F",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#6F9A73",
            fontWeight: 700,
          }}
        >
          A community for curious minds · {siteMeta.city}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 76,
              lineHeight: 1.02,
              color: "#F9F1DF",
              fontWeight: 800,
              letterSpacing: -1,
            }}
          >
            If you ever say
          </div>
          {/* The marker highlight, flattened to a filled block. */}
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              marginTop: 10,
              padding: "6px 18px",
              backgroundColor: "#E2CFA9",
              color: "#2A3B2F",
              fontSize: 76,
              lineHeight: 1.02,
              fontWeight: 800,
              letterSpacing: -1,
              borderRadius: 4,
            }}
          >
            idk why I reacted that way
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 14,
              fontSize: 60,
              color: "#6F9A73",
              fontStyle: "italic",
              fontWeight: 400,
            }}
          >
            this conversation is for you
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid rgba(249,241,223,0.18)",
            paddingTop: 26,
            fontSize: 24,
            color: "rgba(249,241,223,0.62)",
          }}
        >
          <div style={{ display: "flex", color: "#F9F1DF", fontWeight: 700 }}>
            {siteMeta.name}
          </div>
          <div style={{ display: "flex" }}>
            {siteMeta.members} members · ₹{siteMeta.fee} a seat · Phones in a box
          </div>
        </div>
      </div>
    ),
    size,
  );
}
