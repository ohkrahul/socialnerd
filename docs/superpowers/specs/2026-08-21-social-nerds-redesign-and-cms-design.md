# Social Nerds — visual redesign, Meetup sync, and admin CMS

**Date:** 2026-08-21
**Status:** awaiting review

## Problem

The homepage is built and renders, but it fails three ways.

1. **It is dressed in the wrong assets.** The hero "photograph" is an Instagram
   poster: pixel art on a blue-purple gradient, the one colour family the brief
   forbids. The second "photograph" is a typographic poster. There is no candid
   photography in the project and none is available.
2. **Most of its content is invented.** Stats, testimonials, venues, hosts, past
   events and the featured event are fabricated. Four testimonials attribute
   quotes to people who do not exist. For a community whose entire pitch is
   honesty, this is the central defect, and fabricated endorsements carry real
   exposure under Indian consumer-protection rules on misleading advertising.
3. **There is no way to book.** Every call to action is `#` or a bare
   `meetup.com` link. The site cannot convert a visitor into an attendee.

## Verified facts

From the live Meetup group and the assets in the repo, on 2026-08-21.

| Fact | Value |
|---|---|
| Group | Social Nerds: The Conversation Community |
| Group URL | `meetup.com/mumbai-social-intelligence-meetup-group` |
| Members | 153 |
| Instagram | `@socialnerdsofficial` |
| Fee | ₹299 |
| Venues | Slow Brew, Chembur · Unfiltered, Vikhroli |
| Events to date | 4, **all in the past** |
| Upcoming events | **none** |
| Payment | RSVP on Meetup, then pay via WhatsApp |

Group description, verbatim:

> We are a community of curious minds, thinkers, builders, and learners, who
> gather in real life to reclaim our collective superpower: the art of
> intentional, screen-free conversation.

The four real events:

| Meetup id | When | Topic | Venue |
|---|---|---|---|
| 315440781 | 28 Jun 2026, 7:00 PM | — | — |
| 315440778 | 4 Jul 2026, 7:00 PM | Emotional Intelligence | Unfiltered, Vikhroli |
| 315569326 | 18 Jul 2026, 11:00 AM | Are You Emotionally Intelligent? | Slow Brew, Chembur |
| 315737367 | 25 Jul 2026, 11:00 AM | Mental Health Overhyped? | Slow Brew, Chembur |

Available media: 4 real event posters on `secure-content.meetupstatic.com`, 3
real vertical phone Reels (720×1280, 12s / 22s / 94s). No candid photography,
and the design must never require any.

## Decisions taken

| Question | Decision |
|---|---|
| Invented content | Replace with verifiable facts only. Delete the testimonials section. |
| Booking | Route to Meetup. No payment integration. Admin supplies the URL. |
| Primary CTA | "Tell me when the next one is" — email capture, because nothing is scheduled. |
| Photography | None available. Design around posters and Reels. |
| CMS scope | Events + notify list only. Everything else stays in `lib/content.js`. |
| Admin auth | Single password, scrypt hash, signed cookie. |
| Infra | Vercel + Neon Postgres. Verified reachable: Postgres 18.6, empty. |
| Posters | Downloaded at sync time, served locally. |

---

## Part A — Visual redesign

Ships independently. No database dependency.

### Signature

**The only screen we allow.** The vertical Reels play inside a phone frame —
footage shot on a phone, at an event where phones go into a box by the door.
The 9:16 constraint becomes the concept rather than a cropping problem.

Second device: **the page is built from questions, not slogans.** Section
headings are questions, each struck with a sand highlight that draws
left-to-right like a marker pen — taken from the yellow highlight on the
community's own Slow Brew poster.

### Hero

Leads with the community's own best line, from their 18 July poster:

> IF YOU EVER SAY **IDK WHY I REACTED THAT WAY** THIS CONVERSATION IS FOR YOU

"IDK WHY I REACTED THAT WAY" carries the sand highlight. "this conversation is
for you" resolves in Instrument Serif italic, sage. A Reel plays in the phone
frame to the right, captioned *"the only screen we allow"*. Trust row below:
`153 members · ₹299 · Chembur · phones in a box`.

The brand tagline ("Less scrolling. More thinking. Better conversations.")
demotes to a smaller role. This is the one deliberate risk in the design:
slogans do not move people, and a second-person question makes the visitor
answer something before anything is asked of them.

### Tokens

**Colour** — palette unchanged, the brief pins it. What changes is ratio:
inverted to **ink-dominant**, with ivory as the paper insert on a dark ground
rather than the page's default background. This stays within the brief's own
words ("dark green immersive sections", "ivory and beige *content areas*") and
avoids the cream-plus-serif look that most machine-generated editorial pages
currently land on.

**Type — three faces, down from four.**

| Face | Role |
|---|---|
| Instrument Serif | the site's voice — headlines, pull quotes |
| Manrope | body, UI, and eyebrows (wide-tracked) |
| Anton, caps, tight | **the room's voice** — questions only |

Anton matches the heavy condensed caps on the community's real posters, so the
question voice is drawn from their existing identity rather than invented.
JetBrains Mono is cut; Manrope with wide tracking covers the eyebrow role.

**Motion** — one orchestrated hero moment: video fades up, headline lines mask
in, highlight strokes across. Existing scroll reveals stay. Nothing new is
added elsewhere.

### Deletions

- `components/Thread.js` — a 0.5-opacity, 1.5px line in a gutter that no one
  can see, costing a full-document ScrollTrigger.
- `components/Testimonials.js` — four invented people.
- JetBrains Mono from `layout.js` and the `.eyebrow` rule.

### Content rewrite

`lib/content.js` keeps its shape as the Sequelize-mirroring seam. Values become
real:

- Stats: `153 Members · ₹299 a seat · 8–12 per room · Chembur, Mumbai · 100% Screen-free`.
  The invented "5.0 Meetup Rating" is dropped as unverifiable.
- Past events: the 4 real ones, showing date, venue and the memorable question.
  **Attendance is not shown** — one real event drew a single attendee, and the
  honest choice is to omit the field rather than either inflate it or undercut
  the page.
- Featured event: none, so the section renders the empty state.
- Venues, topics and hosts: real, or removed where no data exists (no organiser
  is listed on Meetup, so the host field goes).
- Duration corrected: events run ~2 hours at 11:00 AM, not four hours at 5:00 PM.

### Media prep

`loop-03.mp4` (12s, 2.0 MB) is the hero loop, trimmed to a clean cut with a
poster frame extracted so the hero never ships 8 MB. `loop-01.mp4` (94s) is not
used in the hero.

---

## Part B — Meetup sync and admin CMS

### Why sync rather than manual entry

Every Meetup event page publishes complete `schema.org` JSON-LD: `name`,
`startDate`, `endDate`, `eventStatus`, `location` with a full `PostalAddress`,
`image` in three crops, `organizer`, and the full `description`. The admin
already does this work once in Meetup. Retyping it into a second CMS is the
thing to design away.

Not in JSON-LD, and therefore admin-supplied: the fee (parseable as `₹(\d+)`
from the description, but confirmed by the admin), capacity, seats remaining,
the memorable question, and the editorial subtitle.

### Flow

```
admin pastes Meetup event URL
        ↓
POST /api/admin/import          fetch page → parse ld+json → regex ₹(\d+)
        ↓
draft, pre-filled:  title · start · end · venue · address · poster · status
        ↓
admin adds only what Meetup cannot know:
   memorable question · subtitle · featured? · capacity · seats
        ↓
   [ Save draft ]  →  [ Preview ]  →  [ Publish ]
```

Nightly, `/api/cron/sync` re-reads the group events page, discovers event ids
by regex, creates **drafts** for anything unseen, and re-syncs known events.

Two consequences worth stating. New events never auto-publish — a Meetup edit
must not silently change the homepage. And `eventStatus` flipping to
`EventCancelled` drives the site's cancelled state automatically, so a required
state in the brief is fed by real data instead of a manual toggle.

### Fragility

Every sync writes through to Postgres, so the site always renders the last-good
copy. A parse failure sets `syncError`, stops updating that row, and surfaces in
the admin — it never blanks the page. Meetup's official API is Pro-only and
paid; the JSON-LD we read is markup Meetup publishes for machines, and the API
remains the upgrade path if a contractual guarantee is ever needed.

### Schema

```
Event
  id                 uuid pk
  meetupId           text unique          -- "315737367"
  meetupUrl          text
  title              text
  slug               text unique
  subtitle           text null            -- editorial
  description        text                 -- synced
  memorableQuestion  text null            -- editorial
  startAt            timestamptz
  endAt              timestamptz null
  venueName          text
  venueAddress       text
  city               text default 'Mumbai'
  feeInr             integer null
  capacity           integer null         -- editorial
  seatsRemaining     integer null         -- editorial
  posterPath         text null            -- /media/events/<meetupId>.jpg
  posterSourceUrl    text null
  attendance         integer null         -- editorial, post-event
  recapUrl           text null
  meetupStatus       text                 -- synced: scheduled|cancelled|postponed
  status             text                 -- editorial: draft|published|cancelled
  publishAt          timestamptz null     -- null = live as soon as published
  featured           boolean default false
  syncedAt           timestamptz
  syncError          text null
  createdAt / updatedAt

Subscriber
  id             uuid pk
  email          text unique (lowercased)
  name           text null
  source         text                     -- hero | event-full | final-cta
  confirmedAt    timestamptz null
  unsubscribedAt timestamptz null
  createdAt
```

Two status columns, deliberately: `meetupStatus` is synced and never edited,
`status` is editorial. Keeping them separate lets the admin see "Meetup says
cancelled" and still control what the site shows.

`completed` is **not** a stored status — it is derived from `endAt < now()`. That
removes a manual step and a field. `attendance` and `recapUrl` are the things an
admin actually fills in after an event.

### Modules

| Path | Responsibility |
|---|---|
| `lib/db.js` | Sequelize instance from `DATABASE_URL` |
| `lib/models/*.js` | `Event`, `Subscriber` |
| `lib/meetup/parse.js` | **pure**: HTML string → event object. Throws if no Event JSON-LD. |
| `lib/meetup/sync.js` | `discoverEventIds`, `syncEvent`, `syncAll`, poster download |
| `lib/auth.js` | `verifyPassword`, `createSession`, `requireAdmin` |
| `lib/events.js` | `getFeaturedEvent`, `getArchive` — the public read layer |

`parse.js` is pure and network-free, which is why it is the one module that gets
a test.

### Auth

- `ADMIN_PASSWORD_HASH` — `scrypt`, stored `salt:hash`, compared with
  `timingSafeEqual`. Generated by `scripts/hash-password.js`.
- Session — `HMAC-SHA256` signed token, `httpOnly` + `Secure` +
  `SameSite=Strict`, 7-day expiry.
- Checked in **both** the admin layout and every admin route handler. Defence in
  depth; a layout check alone does not protect a route handler.
- Login rate limit: 5 attempts / 15 minutes, keyed by IP.
  `ponytail: in-memory Map, so per-instance. Move to a table if it matters.`

No `shadcn/ui`. The admin is forms and a table, and the site already has a
design system to style them with. Adding Radix, CVA and tailwind-merge for six
screens is scaffolding, not leverage.

### Admin screens

| Route | Purpose |
|---|---|
| `/admin/login` | password |
| `/admin` | event table + "Import from Meetup" + subscriber count |
| `/admin/events/new` | paste URL → prefilled draft |
| `/admin/events/[id]` | edit; save draft / publish / cancel / duplicate / re-sync |
| `/admin/subscribers` | list + **CSV export** |

Preview: the homepage accepts `?previewEvent=<id>` and honours it only when an
admin session cookie is present.

CSV export exists so the notify list is usable on day one without an email
provider wired up. Sending email is explicitly out of scope here.

### Public event states

`getFeaturedEvent()` returns the featured published event, else the soonest
future published event, else `null`.

| Condition | Rendered |
|---|---|
| `null` | "No conversation scheduled yet" + notify form — **today's real state** |
| future, seats > 0 | book on Meetup, ₹299, with the 3-step funnel |
| future, seats = 0 | full → notify form framed as a waitlist |
| cancelled | cancelled notice + notify form |

The 3-step funnel is stated plainly, because it is what actually happens:

1. RSVP on Meetup
2. Pay ₹299 over WhatsApp
3. Spot confirmed

Hiding that behind a single "Book now" button creates a surprise. Naming it
builds trust.

## Out of scope

- Payment integration of any kind. Meetup and WhatsApp handle money.
- Email **sending**. Capture and CSV export only.
- Cloudinary. Meetup hosts the posters; `next/image` handles optimisation.
  Revisit when an admin needs to upload original artwork.
- CMS management of topics, questions, FAQs, rules, stats, hero copy, gallery,
  SEO and social links. These live in `lib/content.js` until someone needs to
  edit them without a deploy.
- User accounts. Nobody logs into a 12-person meetup.
- Double opt-in. The `confirmedAt` column exists for it; the flow does not.

## Sequence

The hero's primary call to action is the notify form, so the smallest slice of
database has to land before Part A rather than after it.

1. **B0** — `lib/db.js`, `Subscriber` model, `POST /api/notify`. One table, one
   endpoint, so the redesigned hero has something real to submit to.
2. **A** — visual redesign, content rewrite, media prep.
3. **B1** — `Event` model, `lib/meetup/parse.js` + its test, `sync.js`, poster download.
4. **B2** — auth, admin screens, CSV export.
5. **B3** — wire the public site to the database; all four event states.

Part A is the only part that changes how the site looks, so it is the one to
review on screen before continuing.

## Risks

| Risk | Mitigation |
|---|---|
| Meetup changes its markup | Last-good copy in Postgres; `syncError` surfaces it; never blanks the page |
| Neon credential was shared in plaintext | Rotate it in the Neon console once the build is verified |
| Anton reads too blunt next to Instrument Serif | Confined to questions only; falls back to Manrope 800 caps if it fights the serif |
| Demoting the tagline is wrong | Reversible in one file; it remains on the page, just smaller |
| Real numbers are small (153 members, 8 attendees) | Framed as intimacy, which is the actual product. Rooms of 8–12 are the point. |
