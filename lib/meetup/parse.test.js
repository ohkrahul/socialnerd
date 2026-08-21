import assert from "node:assert/strict";
import test from "node:test";
import {
  discoverEventIds,
  extractMeetupId,
  parseEventPage,
  slugify,
} from "./parse.js";

/**
 * Run with: node --test lib/meetup/
 *
 * Fixtures are the real shapes Meetup serves — including the two awkward ones
 * this parser exists to survive: events typed `FoodEvent` rather than `Event`,
 * and a fee that lives in the description body instead of a schema.org field.
 */

const page = (ld) =>
  `<html><head>
     <script type="application/ld+json">{"@type":"Organization","name":"Meetup"}</script>
     <script type="application/ld+json">${JSON.stringify(ld)}</script>
   </head><body>ignored</body></html>`;

const REAL = {
  "@context": "https://schema.org",
  "@type": "FoodEvent",
  name: "Mental Health Overhyped?",
  url: "https://www.meetup.com/mumbai-social-intelligence-meetup-group/events/315737367/",
  description: "**Cost**/**Entry**: ₹299/-\n\nWe live in a world where therapy…",
  startDate: "2026-07-25T11:00:00+05:30",
  endDate: "2026-07-25T13:00:00+05:30",
  eventStatus: "https://schema.org/EventScheduled",
  image: [
    "https://secure-content.meetupstatic.com/images/classic-events/535256373/676x676.jpg",
    "https://secure-content.meetupstatic.com/images/classic-events/535256373/676x380.jpg",
  ],
  location: {
    "@type": "Place",
    name: "Slow Brew",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Mumbai",
      streetAddress: "Shop No:23, Ground floor, NEELKANTH GARDENS, Deonar, Chembur",
    },
  },
  organizer: { "@type": "Organization", name: "Social Nerds: The Conversation Community" },
};

test("parses a real event page", () => {
  const event = parseEventPage(page(REAL));

  assert.equal(event.meetupId, "315737367");
  assert.equal(event.title, "Mental Health Overhyped?");
  assert.equal(event.slug, "mental-health-overhyped");
  assert.equal(event.venueName, "Slow Brew");
  assert.equal(event.city, "Mumbai");
  assert.equal(event.meetupStatus, "scheduled");
  assert.equal(event.organizerName, "Social Nerds: The Conversation Community");
  assert.equal(event.imageUrls.length, 2);
  assert.equal(event.startAt.toISOString(), "2026-07-25T05:30:00.000Z");
  assert.equal(event.endAt.toISOString(), "2026-07-25T07:30:00.000Z");
});

test("reads the fee out of the description, since schema.org has no field for it", () => {
  assert.equal(parseEventPage(page(REAL)).feeInr, 299);

  // Written without the trailing "/-", and with a thousands separator.
  const pricier = { ...REAL, description: "Entry is ₹1,499 per person" };
  assert.equal(parseEventPage(page(pricier)).feeInr, 1499);

  // No price mentioned: null, so an admin is asked rather than a wrong price
  // being published.
  const free = { ...REAL, description: "Just turn up." };
  assert.equal(parseEventPage(page(free)).feeInr, null);
});

test("maps eventStatus onto our own vocabulary", () => {
  const status = (eventStatus) =>
    parseEventPage(page({ ...REAL, eventStatus })).meetupStatus;

  // Both Vikhroli events really are cancelled, so this path is live, not
  // hypothetical — it drives the cancelled state on the public site.
  assert.equal(status("https://schema.org/EventCancelled"), "cancelled");
  assert.equal(status("https://schema.org/EventPostponed"), "postponed");
  assert.equal(status("https://schema.org/EventScheduled"), "scheduled");
  assert.equal(status(undefined), "scheduled");
});

test("accepts a plain Event and an array of @type", () => {
  assert.equal(parseEventPage(page({ ...REAL, "@type": "Event" })).title, REAL.name);
  assert.equal(
    parseEventPage(page({ ...REAL, "@type": ["Thing", "SocialEvent"] })).title,
    REAL.name,
  );
});

test("survives a malformed JSON-LD block before the real one", () => {
  const html = `<html>
    <script type="application/ld+json">{ this is not json }</script>
    <script type="application/ld+json">${JSON.stringify(REAL)}</script>
  </html>`;
  assert.equal(parseEventPage(html).meetupId, "315737367");
});

test("throws loudly rather than returning a half-empty event", () => {
  assert.throws(() => parseEventPage("<html></html>"), /No Event JSON-LD/);
  assert.throws(
    () => parseEventPage(page({ "@type": "Event", url: REAL.url })),
    /no name/,
  );
  assert.throws(
    () => parseEventPage(page({ "@type": "Event", name: "x", url: REAL.url })),
    /no startDate/,
  );
});

test("handles a missing location without blowing up", () => {
  const { location, ...noPlace } = REAL;
  const event = parseEventPage(page(noPlace));
  assert.equal(event.venueName, null);
  assert.equal(event.venueAddress, null);
  assert.equal(event.city, "Mumbai");
});

test("discovers every event id on a group page, without duplicates", () => {
  const html = `
    <a href="/mumbai-social-intelligence-meetup-group/events/315440778/">one</a>
    <a href="/mumbai-social-intelligence-meetup-group/events/315440778/">same again</a>
    <a href="/mumbai-social-intelligence-meetup-group/events/315737367/?eventOrigin=x">two</a>
    <a href="/mumbai-social-intelligence-meetup-group/">not an event</a>`;
  assert.deepEqual(discoverEventIds(html).sort(), ["315440778", "315737367"]);
  assert.deepEqual(discoverEventIds(""), []);
});

test("extractMeetupId and slugify handle junk", () => {
  assert.equal(extractMeetupId("https://www.meetup.com/g/events/123456/"), "123456");
  assert.equal(extractMeetupId("https://www.meetup.com/g/"), null);
  assert.equal(extractMeetupId(null), null);

  assert.equal(slugify("Are You Emotionally Intelligent?"), "are-you-emotionally-intelligent");
  assert.equal(slugify("  Mixed   CASE  &  Symbols!  "), "mixed-case-symbols");
  assert.equal(slugify(""), "conversation");
});
