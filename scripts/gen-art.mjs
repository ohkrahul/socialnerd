/**
 * Generates the site's illustrations with Gemini.
 *
 *   node --env-file=.env.local scripts/gen-art.mjs            # only missing files
 *   node --env-file=.env.local scripts/gen-art.mjs --force     # redo everything
 *   node --env-file=.env.local scripts/gen-art.mjs phones-away # one by slug
 *
 * Deliberately illustration, never photography. A generated photo of people at a
 * Social Nerds meetup would be fabricated evidence of an event that did not
 * happen — the same problem as an invented testimonial, but harder to spot
 * because a photograph reads as proof. Flat editorial illustration cannot be
 * mistaken for documentation.
 */
import { writeFile, mkdir, access } from "node:fs/promises";
import { ART } from "./art-specs.mjs";

const MODEL = "gemini-3-pro-image";
const OUT = "public/art";

/* The palette is fixed by the brand, so it is stated in every prompt rather
   than left to the model, and every prompt forbids text — type is our job. */
const STYLE = [
  "Flat vector editorial illustration, screen-print / risograph feel with visible",
  "grain and slight ink misregistration.",
  "STRICT palette only: deep forest green #2A3B2F, mid green #3E6B4A,",
  "sage #6F9A73, warm ivory #F9F1DF, sand beige #E2CFA9.",
  "No blue, no purple, no neon, no gradients beyond flat two-tone shading.",
  "Confident hand-drawn line quality, generous negative space, calm and warm.",
  "ABSOLUTELY NO text, letters, numbers, words, logos or signatures anywhere.",
  "No photorealism, no 3D render, no glossy highlights.",
].join(" ");

async function generate(spec) {
  const body = {
    contents: [{ parts: [{ text: `${spec.prompt} ${STYLE}` }] }],
    generationConfig: {
      responseModalities: ["IMAGE"],
      imageConfig: { aspectRatio: spec.aspect ?? "1:1" },
    },
  };

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(180_000),
    },
  );

  if (!response.ok) {
    throw new Error(`${response.status} ${(await response.text()).slice(0, 400)}`);
  }

  const data = await response.json();
  const part = data.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!part) {
    const reason = data.candidates?.[0]?.finishReason ?? "no image in response";
    throw new Error(reason);
  }

  const bytes = Buffer.from(part.inlineData.data, "base64");
  const path = `${OUT}/${spec.slug}.png`;
  await writeFile(path, bytes);
  return { path, kb: Math.round(bytes.byteLength / 1024) };
}

const args = process.argv.slice(2);
const force = args.includes("--force");
const only = args.filter((a) => !a.startsWith("--"));

if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set");
  process.exit(1);
}

await mkdir(OUT, { recursive: true });

const queue = ART.filter((s) => only.length === 0 || only.includes(s.slug));
let made = 0;
let failed = 0;

for (const spec of queue) {
  const path = `${OUT}/${spec.slug}.png`;
  if (!force) {
    try {
      await access(path);
      console.log(`  skip   ${spec.slug} (exists)`);
      continue;
    } catch {
      /* not there yet, generate it */
    }
  }

  try {
    const { kb } = await generate(spec);
    console.log(`  made   ${spec.slug.padEnd(22)} ${kb} KB  ${spec.aspect ?? "1:1"}`);
    made += 1;
  } catch (error) {
    console.error(`  FAIL   ${spec.slug.padEnd(22)} ${error.message}`);
    failed += 1;
  }
}

console.log(`\n${made} generated, ${failed} failed`);
if (failed) process.exitCode = 1;
