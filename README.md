# Social Nerds

Site for [Social Nerds: The Conversation Community](https://www.meetup.com/mumbai-social-intelligence-meetup-group/)
— screen-free conversations in Mumbai.

Next.js App Router · JavaScript · Tailwind v4 · GSAP + Lenis · Sequelize + Postgres (Neon)

## Running it

```bash
pnpm install
cp .env.example .env.local     # then fill it in — see below
pnpm db:push                   # create tables
pnpm sync                      # pull events from Meetup
pnpm dev
```

Admin is at `/admin`.

## Environment

| Variable | What it's for |
|---|---|
| `DATABASE_URL` | Neon Postgres. Keep `sslmode=verify-full`. |
| `ADMIN_PASSWORD_HASH` | From `pnpm hash-password "your-password"` |
| `SESSION_SECRET` | Signs admin sessions **and** unsubscribe links. Changing it signs everyone out and invalidates every unsubscribe link already mailed. |
| `CRON_SECRET` | Bearer token the nightly sync requires |
| `SMTP_*`, `MAIL_FROM` | Gmail SMTP. `SMTP_PASS` is an app password, not the account password. |
| `NEXT_PUBLIC_SITE_URL` | Absolute base for unsubscribe links. **Set this in production** or links point at localhost. |

`pnpm hash-password "…"` prints a hash plus fresh `SESSION_SECRET` and `CRON_SECRET` values.

## How content works

Two things live in Postgres because they change: **events** and the **notify list**.
Everything else — topics, the question pool, FAQs, rules, stats, hero copy — is in
`lib/content.js`, edited by a developer. It changes once or twice a year and does
not need a CMS behind it.

### Events come from Meetup

Meetup publishes complete `schema.org` JSON-LD on every event page, so nothing is
retyped. Paste an event URL into `/admin/events/new` and title, date, venue,
address and poster are filled in. The admin adds only what Meetup cannot know:
the one memorable question, the subtitle, capacity, seats.

`/api/cron/sync` runs nightly (see `vercel.json`), discovers new events from the
group page, and re-syncs known ones. Two rules:

- **New events arrive as drafts.** A Meetup edit must never silently change the
  homepage.
- **Every sync writes through to Postgres.** A parse failure records `syncError`
  and leaves the last-good copy showing. It never blanks a page.

`eventStatus` flipping to `EventCancelled` on Meetup drives the site's cancelled
state automatically.

### Nothing is invented

Every figure on the site is checkable against the live Meetup group. There are no
placeholder testimonials, no rounded-up member counts, no fabricated venues. If
you edit a number in `lib/content.js`, verify it first — the whole pitch of this
community is honest conversation, and a padded stat costs more than it wins.

## Booking

No payment code, by design. Money moves through Meetup and WhatsApp:

1. RSVP on Meetup
2. Pay ₹299 over WhatsApp
3. Seat confirmed

Those three steps are stated on the page rather than hidden behind a button.
The site's own conversion is the notify list.

## Email

Gmail SMTP via nodemailer. A new signup gets one plain-text welcome. Publishing an
event enables **Announce to the list** on the event editor — one message per
person, each with its own signed unsubscribe link, batched to stay inside Gmail's
~500/day limit.

Announcing is deliberately manual. Mailing the whole list should not be a side
effect of ticking publish.

## Scripts

| Command | Does |
|---|---|
| `pnpm dev` / `build` / `start` | the usual |
| `pnpm test` | parser tests (`node:test`, no framework) |
| `pnpm lint` | eslint |
| `pnpm db:push` | create tables from the models; `-- --alter` to migrate |
| `pnpm sync` | pull events from Meetup now |
| `pnpm hash-password "…"` | generate admin credentials |

`db:push` uses `sequelize.sync()`, which is fine while this is the only writer.
Move to real migrations before altering a column that holds data you care about.

## Deploying

Vercel. Set every variable above in project settings, including
`NEXT_PUBLIC_SITE_URL`. `vercel.json` registers the nightly cron at 03:00 IST.

Posters are stored as `bytea` and served from `/api/events/[meetupId]/poster`,
because Vercel's filesystem is read-only at runtime — a cron cannot write into
`public/`.
