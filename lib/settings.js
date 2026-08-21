import { Setting } from "./models/Setting.js";
import { archiveNote, siteMeta, stats as defaultStats } from "./content.js";

/**
 * The editable surface, declared once.
 *
 * Adding a field is one entry here plus reading it wherever it renders — the
 * admin form, validation and persistence all come off this list.
 */
export const FIELDS = [
  {
    key: "members",
    label: "Meetup members",
    type: "number",
    fallback: String(siteMeta.members),
    help: "Shown in the nav, the hero and the figures row. Check it against Meetup — the whole pitch of this community is that its numbers are real.",
  },
  {
    key: "fee",
    label: "Price of a seat (₹)",
    type: "number",
    fallback: String(siteMeta.fee),
    help: "Used in the figures row and on the mobile booking bar. Events carry their own fee; this is the default shown when none is set.",
  },
  {
    key: "archiveNote",
    label: "Archive note",
    type: "textarea",
    fallback: archiveNote.body,
    help: "The paragraph beside the archive. This one goes out of date fastest — it currently claims the community started in July 2026, which its own posters contradict.",
  },
];

const KEYS = new Set(FIELDS.map((f) => f.key));

/** Raw overrides, keyed. Missing table or unreachable DB is not fatal. */
async function overrides() {
  try {
    const rows = await Setting.findAll();
    return Object.fromEntries(
      rows.filter((r) => KEYS.has(r.key) && r.value != null && r.value !== "")
          .map((r) => [r.key, r.value]),
    );
  } catch (error) {
    console.warn(`settings: using content.js defaults (${error.message})`);
    return {};
  }
}

/**
 * Content with overrides applied.
 *
 * Everything derived from an editable figure is rebuilt here rather than in the
 * components, so there is one place that knows a member count appears in three
 * different sentences.
 */
export async function getSiteSettings() {
  const saved = await overrides();
  const members = Number(saved.members ?? siteMeta.members);
  const fee = Number(saved.fee ?? siteMeta.fee);
  const note = saved.archiveNote ?? archiveNote.body;

  return {
    members,
    fee,
    archiveNote: note,
    heroIndicators: [
      { label: `${members} members`, emphasis: true },
      { label: `₹${fee} a seat` },
      { label: "Chembur, Mumbai" },
      { label: "Phones in a box" },
    ],
    stats: defaultStats.map((stat) =>
      stat.label === "Members"
        ? { ...stat, value: String(members) }
        : stat.label === "A seat"
          ? { ...stat, value: `₹${fee}` }
          : stat,
    ),
  };
}

/** Admin form values: saved where present, otherwise the shipped default. */
export async function getEditableValues() {
  const saved = await overrides();
  return FIELDS.map((f) => ({ ...f, value: saved[f.key] ?? f.fallback, saved: f.key in saved }));
}
