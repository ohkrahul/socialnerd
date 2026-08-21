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
  logo: "/media/shot-01.webp",
  /**
   * Broadcast channel, not a chat. Following it is a one-way subscribe, so it
   * belongs with Instagram and Meetup rather than next to the numbers below —
   * nobody reaches a human through it.
   */
  whatsappChannel: "https://www.whatsapp.com/channel/0029VbDB4khFCCoO5J9wjs1C",
  // Enquiries and seat confirmation both happen here.
  whatsapp: "+91 75068 68226",
  whatsappUrl:
    "https://wa.me/917506868226?text=" +
    encodeURIComponent("Hi! I have a question about Social Nerds."),
  /**
   * The number printed on their own event posters, which is not the one above.
   * Both are live, so both are listed rather than picking one and hoping the
   * other is dead. If one of them is retired, delete it here.
   */
  whatsappAlt: "+91 98701 35612",
  whatsappAltUrl:
    "https://wa.me/919870135612?text=" +
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
  /**
    * `emphasis` marks the figure worth noticing. Carried as data rather than
    * decided by array position in the component, so reordering these cannot
    * silently move the emphasis onto the wrong one.
    */
  indicators: [
    { label: `${siteMeta.members} members`, emphasis: true },
    { label: `₹${siteMeta.fee} a seat` },
    { label: "Chembur, Mumbai" },
    { label: "Phones in a box" },
  ],
};

/**
 * Said plainly, because being early is the actual offer. The heading is derived
 * from the real published count in PastEvents; only the body lives here.
 */
export const archiveNote = {
  body: "Started July 2026, both at Slow Brew in Chembur. Whoever turns up next is still early enough to shape what this becomes.",
};

/**
 * The clip that sits beside the recurring-ground list. Portrait, so it fills a
 * side column rather than a full-width band.
 *
 * Note this is the same file as the tall tile in `gallery` above — the only
 * clip that is full-frame room footage rather than letterboxed. Swap one of
 * them for clip-02/05/07 if seeing it twice on one page starts to show.
 */
export const stepsClip = {
  src: "/video/clip-04.mp4",
  poster: "/media/clip-04-poster.jpg",
  alt: "A room at Slow Brew mid-conversation, taken on the one allowed phone",
  caption: "A Saturday, somewhere in the first hour",
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
  { value: `${siteMeta.members}`, label: "Members", emphasis: true },
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
 * Gallery: the community's own media only. No illustration here.
 *
 * The stills are frames pulled from their own footage — real attendees in the
 * real room, several of them holding the question cards that get passed around.
 * They are grainy phone video shot at night and they look like it, which is the
 * point: this is what the evening actually looked like.
 *
 * Illustration still carries the house rules, where a drawing is the brief's own
 * ask and nothing is being claimed as evidence.
 */
/**
 * The experience grid: the community's own footage, nothing else. Captions are
 * either the clip's own on-screen text, quoted verbatim, or a plain description
 * of what is visible in frame. Nothing here narrates an event we cannot see.
 *
 * Landscape only. All four arrived as 16:9 footage letterboxed inside a 9:16
 * reel and the import strips the bars, which is the only reason this set has
 * any landscape material — see scripts/import-assets.mjs. The two portrait
 * clips are still imported and still in Cloudinary; clip-04 is the one beside
 * the steps in HowItWorks, so keeping it here would have shown it twice.
 */
export const gallery = [
  {
    type: "video",
    src: "/video/clip-03.mp4",
    poster: "/media/clip-03-poster.jpg",
    caption: "The room, mid-question",
    span: "wide",
  },
  {
    type: "video",
    src: "/video/clip-02.mp4",
    poster: "/media/clip-02-poster.jpg",
    caption: "A word to camera, before the table filled",
    span: "wide",
  },
  {
    type: "video",
    src: "/video/clip-05.mp4",
    poster: "/media/clip-05-poster.jpg",
    caption: "Wanna do it again?",
    span: "wide",
  },
  {
    type: "video",
    src: "/video/clip-07.mp4",
    poster: "/media/clip-07-poster.jpg",
    caption: "Why are you here?",
    span: "wide",
  },
];

/**
 * Their own event artwork, kept separate from the footage on purpose. These are
 * posters, not photographs of a room, and putting them in the same grid would
 * quietly pass a graphic off as a record of an evening.
 *
 * Captions are transcribed from the artwork itself. Note that these posters
 * describe events in April, May and June 2026 and two different venues, which
 * does not match "2 rooms so far" in archiveNote — see the note there.
 */
export const posters = [
  { src: "/media/shot-06.webp", caption: "If you ever say IDK why I reacted that way", meta: "18 July · Slow Brew, Chembur" },
  { src: "/media/shot-03.webp", caption: "Personal failures", meta: "14 June · Slow Brew, Chembur" },
  { src: "/media/shot-05.webp", caption: "Emotional Intelligence", meta: "4 July · Unfiltered, Vikhroli" },
  { src: "/media/shot-02.webp", caption: "Upcoming schedule", meta: "May 2026" },
  { type: "video", src: "/video/clip-01.mp4", poster: "/media/clip-01-poster.jpg", caption: "Upcoming schedule", meta: "June 2026" },
  { src: "/media/shot-04.webp", caption: "Something curious is brewing in Chembur", meta: "Teaser" },
  // shot-01 is the logo, not a poster. It is the nav mark now — see siteMeta.logo.
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
  whatsappChannel: siteMeta.whatsappChannel,
  whatsapp: siteMeta.whatsappUrl,
  whatsappAlt: siteMeta.whatsappAltUrl,
  suggestTopic: "mailto:hello@socialnerds.in?subject=A%20topic%20worth%20a%20room",
  partnerVenue: "mailto:hello@socialnerds.in?subject=Our%20space%20could%20host%20this",
  contact: "mailto:hello@socialnerds.in",
  privacy: "/privacy",
};
