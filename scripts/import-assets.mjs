/**
 * One-shot import of the community's own Instagram exports into public/.
 *
 * Source folder holds byte-identical duplicates from the downloader ("file (1).jpg"),
 * so selection is by content hash, not filename. Videos are trimmed: several run
 * over a minute, and a muted looping gallery tile that nobody watches to the end
 * should not cost the visitor 11MB. Originals stay in the source folder.
 *
 * Run: node scripts/import-assets.mjs <source-dir>
 */
import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const SRC = process.argv[2];
if (!SRC || !fs.existsSync(SRC)) {
  console.error("usage: node scripts/import-assets.mjs <source-dir>");
  process.exit(1);
}

const FFMPEG = execFileSync(process.platform === "win32" ? "python" : "python3", [
  "-c",
  "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())",
]).toString().trim();

const MEDIA = "public/media";
const VIDEO = "public/video";
const CLIP_SECONDS = 12;

const isImg = (f) => /\.(jpe?g|png)$/i.test(f);
const isVid = (f) => /\.(mp4|mov)$/i.test(f);

// Hash-dedupe, stable order so re-running produces identical names.
const seen = new Map();
for (const name of fs.readdirSync(SRC).sort()) {
  const full = path.join(SRC, name);
  if (!fs.statSync(full).isFile()) continue;
  if (!isImg(name) && !isVid(name)) continue;      // skips ui.webp and stray files
  const h = createHash("sha256").update(fs.readFileSync(full)).digest("hex");
  if (!seen.has(h)) seen.set(h, full);
}

const files = [...seen.values()];
const images = files.filter(isImg);
const videos = files.filter(isVid);
console.log(`unique: ${images.length} images, ${videos.length} videos (${fs.readdirSync(SRC).length - files.length - 1} duplicates skipped)`);

const ff = (args) =>
  execFileSync(FFMPEG, ["-y", "-hide_banner", "-loglevel", "error", ...args]);

const probeDuration = (f) => {
  try {
    const out = execFileSync(FFMPEG, ["-hide_banner", "-i", f], {
      stdio: ["ignore", "ignore", "pipe"],
    });
    return 0;
  } catch (e) {
    const m = /Duration: (\d+):(\d+):([\d.]+)/.exec(e.stderr?.toString() ?? "");
    return m ? +m[1] * 3600 + +m[2] * 60 + +m[3] : 0;
  }
};

const manifest = { images: [], videos: [] };

images.forEach((src, i) => {
  const out = `shot-${String(i + 1).padStart(2, "0")}.webp`;
  // Cap at 1440: the sources top out there, so this never upscales.
  ff(["-i", src, "-vf", "scale='min(1440,iw)':-2", "-quality", "82", path.join(MEDIA, out)]);
  manifest.images.push(`/media/${out}`);
  console.log(`  img -> ${out}`);
});

/**
 * Several of these reels are 16:9 footage sitting inside a 9:16 frame with black
 * bars above and below. Shown as a portrait tile, most of the tile is bar. So we
 * ask ffmpeg where the picture actually is and cut the rest away — which is also
 * the only reason this set has any landscape material in it at all.
 */
const detectCrop = (src, start) => {
  // spawnSync, not execFileSync: cropdetect writes to stderr and ffmpeg exits 0,
  // so a try/catch around execFileSync never sees the output it needs.
  const { stderr } = spawnSync(FFMPEG, ["-hide_banner", "-ss", String(start),
    "-i", src, "-vf", "cropdetect=24:2:0", "-frames:v", "60", "-f", "null", "-"],
    { encoding: "utf8" });
  const last = [...(stderr ?? "").matchAll(/crop=(\d+):(\d+):(\d+):(\d+)/g)].at(-1);
  if (!last) return null;
  const [, w, h, x, y] = last.map(Number);
  return { w, h, x, y };
};

videos.forEach((src, i) => {
  const n = String(i + 1).padStart(2, "0");
  const mp4 = `clip-${n}.mp4`;
  const poster = `clip-${n}-poster.jpg`;
  const dur = probeDuration(src);
  // Start a tenth of the way in: these clips open on a fade or a held frame.
  const start = Math.min(dur * 0.1, 3);

  const crop = detectCrop(src, start);
  const cropped = crop && crop.h > 0 && (crop.y > 4 || crop.x > 4);
  const vf = cropped
    ? `crop=${crop.w}:${crop.h}:${crop.x}:${crop.y},scale='min(720,iw)':-2`
    : "scale='min(720,iw)':-2";

  ff([
    "-ss", String(start), "-i", src, "-t", String(CLIP_SECONDS),
    "-an",                                  // muted in the markup; the track is dead weight
    "-vf", vf,
    "-c:v", "libx264", "-crf", "28", "-preset", "slow",
    "-movflags", "+faststart",
    path.join(VIDEO, mp4),
  ]);
  ff(["-ss", String(start + CLIP_SECONDS / 2), "-i", src, "-vf", vf,
      "-frames:v", "1", "-q:v", "4", path.join(MEDIA, poster)]);

  const w = cropped ? crop.w : 720;
  const h = cropped ? crop.h : 1280;
  manifest.videos.push({
    src: `/video/${mp4}`,
    poster: `/media/${poster}`,
    orientation: h > w * 1.1 ? "portrait" : "landscape",
  });
  const kb = Math.round(fs.statSync(path.join(VIDEO, mp4)).size / 1024);
  console.log(`  vid -> ${mp4} (${kb}KB, ${w}x${h}${cropped ? " cropped from 720x1280" : ""}, ${dur.toFixed(0)}s source)`);
});

fs.writeFileSync("scripts/asset-manifest.json", JSON.stringify(manifest, null, 2));
console.log(`\nmanifest -> scripts/asset-manifest.json`);
