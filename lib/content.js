/**
 * Site content.
 *
 * EVERYTHING HERE IS VERIFIABLE. Figures come from the live Meetup group
 * (meetup.com/mumbai-social-intelligence-meetup-group) and the community's own
 * Instagram posters, checked 2026-08-21. Nothing is aspirational, and nothing
 * is attributed to a person who did not say it.
 *
 * If you edit a number here, check it against Meetup first. The whole pitch of
 * this community is honest conversation; a padded stat undoes more than it wins.
 *
 * Events and the notify list live in Postgres (lib/models/, read via
 * lib/events.js). Everything in this file changes once or twice a year and
 * deliberately does not have a CMS behind it.
 */

export const siteMeta = {
  name: "Social Nerds",
  tagline: "Less scrolling. More thinking. Better conversations.",
  // The group's own description, verbatim from Meetup.
  description:
    "We are a community of curious minds, thinkers, builders, and learners, who gather in real life to reclaim our collective superpower: the art of intentional, screen-free conversation.",
  city: "Mumbai",
  members: 153,
  fee: 299,
  meetupUrl: "https://www.meetup.com/mumbai-social-intelligence-meetup-group/",
  instagram: "https://instagram.com/socialnerdsofficial",
  handle: "@socialnerdsofficial",
  // Enquiries and seat confirmation both happen here.
  whatsapp: "+91 75068 68226",
  whatsappUrl:
    "https://wa.me/917506868226?text=" +
    encodeURIComponent("Hi! I have a question about Social Nerds."),
};

export const nav = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "The Archive", href: "#archive" },
  { label: "Is It For You", href: "#about" },
  { label: "FAQ", href: "#faq" },
];

/**
 * The headline is the community's own copy, from their 18 July poster. It is
 * the best writing in the project and it is already theirs — a second-person
 * question makes a visitor answer something before anything is asked of them,
 * which a slogan cannot do.
 */
export const hero = {
  eyebrow: "A community for curious minds · Mumbai",
  headline: {
    before: "If you ever say",
    marked: "idk why I reacted that way",
    after: "this conversation is for you",
  },
  body: "Two hours, one question, and a room where every phone is in a box by the door. No speaker, no slides, no networking.",
  primaryCta: { label: "Tell me when the next one is" },
  /**
   * Real attendees talking to camera straight after a conversation — the
   * community's own footage, which turned out to be 16:9 letterboxed inside a
   * vertical canvas. Cropped back to its real frame.
   *
   * The clip has sound. Muted it is wallpaper, so the hero offers an unmute:
   * people saying what the room was like beats any sentence we could write.
   */
  video: {
    src: "/video/hero-wide.mp4",
    poster: "/media/hero-poster.jpg",
    alt: "Three people who attended a conversation, talking to camera in the café afterwards",
    caption: "Attendees, just after a conversation.",
  },
  indicators: [
    `${siteMeta.members} members`,
    `₹${siteMeta.fee} a seat`,
    "Chembur, Mumbai",
    "Phones in a box",
  ],
};

/**
 * Said plainly, because being early is the actual offer. The heading is derived
 * from the real published count in PastEvents; only the body lives here.
 */
export const archiveNote = {
  body: "Started July 2026, both at Slow Brew in Chembur. Whoever turns up next is still early enough to shape what this becomes.",
};

export const steps = [
  {
    title: "You arrive as you are",
    body: "No introductions by job title. No elevator pitch. Just your name and whatever you turned up thinking about.",
  },
  {
    title: "Phones go in the box",
    body: "Everything goes into a box by the door. For the next two hours nobody can look something up, or look away.",
  },
  {
    title: "One question opens the room",
    body: "A single question, read aloud. Whoever wants to answer first, answers first. The room takes it from there.",
  },
  {
    title: "Everyone becomes part of it",
    body: "Not a panel, not a workshop. By the second hour the quietest person in the room has usually said the sharpest thing.",
  },
];

/** Shown as a plain row under the four steps, not as eight hover cards. */
export const topics = [
  { name: "Emotional Intelligence", question: "Are we emotionally intelligent — or have we only learned the vocabulary?" },
  { name: "Human Behaviour", question: "Why do we keep doing the thing we already decided to stop doing?" },
  { name: "Relationships", question: "What do you need that you have never asked for out loud?" },
  { name: "Identity", question: "How much of who you are was actually chosen by you?" },
  { name: "Productivity", question: "What are you being so efficient in order to avoid?" },
  { name: "Failure", question: "Which failure are you still editing into a better story?" },
  { name: "Mental Models", question: "What is a belief you hold that you have never tested?" },
  { name: "Technology and Society", question: "If the feed knows you better than your friends do, what does it owe you?" },
];

export const stats = [
  { value: `${siteMeta.members}`, label: "Members" },
  { value: `₹${siteMeta.fee}`, label: "A seat" },
  { value: "8–12", label: "Per room" },
  { value: "2 hrs", label: "One question" },
  { value: "100%", label: "Screen-free" },
];

/**
 * House rules. Each card carries a generated illustration rather than a line
 * icon — the brief asks for "minimal illustration" here, and a drawing does more
 * work than a glyph.
 *
 * The art is illustration on purpose. See scripts/art-specs.mjs: nothing
 * generated for this site depicts a person's face, because a photo-like image of
 * attendees would be fabricated evidence of a meetup that never happened.
 */
export const rules = [
  {
    title: "Phones Away",
    body: "In the box by the door. A conversation anyone can escape at any moment is not really a conversation.",
    art: "/art/rule-phones.png",
    alt: "A wooden crate on a cafe table with phones lying face down inside it",
  },
  {
    title: "Curiosity Before Certainty",
    body: "Arrive with questions rather than positions. The point is not to win the room.",
    art: "/art/rule-curiosity.png",
    alt: "A hand holding a magnifying glass over an open blank notebook",
  },
  {
    title: "Disagree Without Dismissing",
    body: "You can take an idea apart without taking a person apart. Say the harder thing, kindly.",
    art: "/art/rule-disagree.png",
    alt: "Two empty speech bubbles overlapping gently above a cafe table",
  },
  {
    title: "Everyone Participates",
    body: "Listening counts. Sitting back and observing the whole evening does not.",
    art: "/art/rule-everyone.png",
    alt: "Eight empty cafe chairs in a circle seen from above, one turned outward",
  },
];

/**
 * The gallery mixes the community's own footage and posters with illustration.
 * The two are visually distinct on purpose — the clips are documentary, the
 * drawings obviously are not, so nothing here can be mistaken for a photograph
 * of an event.
 */
export const gallery = [
  {
    type: "video",
    src: "/video/room-tall.mp4",
    caption: "It's time for a real conversation",
    span: "tall",
  },
  {
    type: "art",
    src: "/art/room-circle.png",
    caption: "Chairs pulled into a circle, before anyone arrives",
    span: "wide",
  },
  {
    type: "poster",
    src: "/media/meetup-02.jpg",
    caption: "18 July · Slow Brew, Chembur",
    span: "normal",
  },
  {
    type: "art",
    src: "/art/gallery-notebook.png",
    caption: "The notebook goes round the table",
    span: "normal",
  },
  {
    type: "video",
    src: "/video/room-wide.mp4",
    caption: "Afterwards, nobody left quickly",
    span: "wide",
  },
  {
    type: "art",
    src: "/art/gallery-cups.png",
    caption: "Two hours, one question",
    span: "normal",
  },
];

export const audience = {
  forYou: {
    heading: "You'll probably enjoy this if…",
    items: [
      "You are genuinely curious about how people work",
      "You want conversations that go past the first layer",
      "You are tired of rooms where everyone is quietly selling something",
      "You can hear a view you disagree with without correcting it",
    ],
  },
  notForYou: {
    heading: "This may not be for you if…",
    items: [
      "You are hoping to pitch something",
      "You want an audience more than a conversation",
      "You expect a speaker, slides and a takeaway framework",
      "You would rather be right than be interested",
    ],
  },
};

/** Answers match how this actually works, including the WhatsApp payment step. */
export const faqs = [
  {
    q: "How do I reserve a seat?",
    a: "RSVP on Meetup, then pay ₹299 over WhatsApp. Your spot is not confirmed until the payment is done — that's Meetup's RSVP plus our confirmation, not a checkout on this site.",
  },
  {
    q: "Is this a networking event?",
    a: "No. Nobody will ask what you do for work unless it happens to be relevant to the question on the table. If you leave with a contact, it's a side effect, not the point.",
  },
  {
    q: "Do I need to be an expert?",
    a: "No. There is no expert in the room by design. Curiosity is the only prerequisite, and it is not a credential.",
  },
  {
    q: "Will I have to speak?",
    a: "Nobody is put on the spot and nobody is called on. But sitting silently for two hours isn't really participating, and the room will gently make space for you.",
  },
  {
    q: "Can I attend alone?",
    a: "Most people do. It is genuinely easier alone — you are not managing anyone else's evening.",
  },
  {
    q: "Where do the conversations happen?",
    a: "Slow Brew in Chembur, at Neelkanth Gardens, Deonar. Earlier attempts ran at Unfiltered in Vikhroli. The exact venue is always confirmed with your booking.",
  },
  {
    q: "Are phones really prohibited?",
    a: "They go in a box by the door for the two hours. You get them back. If you're on call for work or family, tell the host and we'll make an exception.",
  },
  {
    q: "Can I ask something first?",
    a: "Yes — message us on WhatsApp at +91 75068 68226. A person answers, usually the same day. It's the same number your seat gets confirmed on.",
  },
  {
    q: "When is the next one?",
    a: "Not scheduled yet — the last conversation was 25 July 2026. Leave your email and you'll hear the moment a date is set, before it goes up on Meetup.",
  },
];

export const finalCta = {
  headline: { before: "Your feed can wait.", marked: "This conversation cannot." },
  body: "Two hours. One question. A room of strangers who came to think out loud. Leave your email and you'll be the first to know when the next date is set.",
  secondaryCta: { label: "See the community on Meetup", href: siteMeta.meetupUrl },
  // A question is a lower bar than an email address, so it gets its own way out.
  whatsappCta: { label: "Ask on WhatsApp", href: siteMeta.whatsappUrl },
};

export const social = {
  instagram: siteMeta.instagram,
  meetup: siteMeta.meetupUrl,
  whatsapp: siteMeta.whatsappUrl,
  suggestTopic: "mailto:hello@socialnerds.in?subject=A%20topic%20worth%20a%20room",
  partnerVenue: "mailto:hello@socialnerds.in?subject=Our%20space%20could%20host%20this",
  contact: "mailto:hello@socialnerds.in",
  privacy: "/privacy",
};
