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
 * Events and the notify list move to Postgres (see lib/models/). The rest lives
 * here on purpose — it changes once or twice a year and does not need a CMS.
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
};

export const nav = [
  { label: "Conversations", href: "#conversations" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Topics", href: "#topics" },
  { label: "About", href: "#about" },
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
  secondaryCta: { label: "See how it works", href: "#how-it-works" },
  // Real footage. The organiser in the room at Slow Brew, holding the Social
  // Nerds notebook. The community overlays fake iOS notifications on their own
  // Reels, which is where the phone framing comes from.
  video: {
    src: "/video/hero-loop.mp4",
    poster: "/media/hero-poster.jpg",
    alt: "An organiser mid-sentence in the café at Slow Brew, holding a Social Nerds notebook",
    caption: "The only screen we allow.",
  },
  indicators: [
    `${siteMeta.members} members`,
    `₹${siteMeta.fee} a seat`,
    "Chembur, Mumbai",
    "Phones in a box",
  ],
};

/**
 * No conversation is scheduled right now — the last one ran 25 July 2026. The
 * site tells the truth about that rather than inventing an event, and flips to
 * booking the moment one is published. Until Postgres is wired in (B3), this
 * shape is what lib/events.js will return.
 */
export const featuredEvent = null;

/**
 * Real history. Two conversations held; two earlier attempts at Unfiltered in
 * Vikhroli were cancelled, which is why the venue is now Slow Brew in Chembur.
 *
 * Attendance is deliberately not displayed. One of these rooms drew eight
 * people and that is the honest number, but a card is not the place to make a
 * visitor do arithmetic about whether anyone came.
 */
export const pastEvents = [
  {
    meetupId: "315737367",
    title: "Mental Health Overhyped?",
    date: "25 July 2026",
    time: "11:00 AM",
    venue: "Slow Brew, Chembur",
    // Drawn from the community's own event description.
    question: "Have we started wearing our diagnoses instead of working through them?",
    meetupUrl:
      "https://www.meetup.com/mumbai-social-intelligence-meetup-group/events/315737367/",
  },
  {
    meetupId: "315569326",
    title: "Are You Emotionally Intelligent?",
    date: "18 July 2026",
    time: "11:00 AM",
    venue: "Slow Brew, Chembur",
    question: "We optimise for IQ. So who taught you to sit inside a difficult conversation?",
    meetupUrl:
      "https://www.meetup.com/mumbai-social-intelligence-meetup-group/events/315569326/",
  },
];

/** Two rooms in. Said plainly, because being early is the actual offer. */
export const archiveNote = {
  heading: "Two rooms so far.",
  body: "This community started in July 2026. Two conversations have happened, both at Slow Brew in Chembur, and the third is being planned. Whoever turns up next is still early enough to shape what this becomes.",
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

export const questions = [
  "What opinion have you changed recently?",
  "What is something you believe that most people around you don't?",
  "When did you last change your mind mid-argument?",
  "What do you pretend to understand?",
  "Which compliment do you find hardest to accept?",
  "What would you do differently if nobody would ever find out?",
  "What is a boundary you wish you had set five years ago?",
  "Which part of your life are you narrating instead of living?",
];

/**
 * Real media only: the community's own Reels and their own event posters. There
 * is no candid photography of these meetups, so the gallery does not pretend
 * otherwise — posters are presented as posters.
 */
export const gallery = [
  {
    type: "video",
    src: "/video/loop-02.mp4",
    caption: "It's time for a real conversation",
    span: "tall",
  },
  {
    type: "poster",
    src: "/media/meetup-02.jpg",
    caption: "18 July · Slow Brew, Chembur",
    span: "normal",
  },
  {
    type: "video",
    src: "/video/hero-loop.mp4",
    caption: "The room, before anyone sits down",
    span: "normal",
  },
  {
    type: "note",
    note: "Knowing the vocabulary is not the same as practising empathy.",
    caption: "From the 18 July conversation",
    span: "wide",
  },
];

/**
 * Verified figures only. No event count (two is thin and the archive already
 * says so honestly) and no star rating (nothing public to cite).
 */
export const stats = [
  { value: `${siteMeta.members}`, label: "Members" },
  { value: `₹${siteMeta.fee}`, label: "A seat" },
  { value: "8–12", label: "Per room" },
  { value: "2 hrs", label: "One question" },
  { value: "100%", label: "Screen-free" },
];

export const rules = [
  {
    title: "Phones Away",
    body: "In the box by the door. A conversation anyone can escape at any moment is not really a conversation.",
  },
  {
    title: "Curiosity Before Certainty",
    body: "Arrive with questions rather than positions. The point is not to win the room.",
  },
  {
    title: "Disagree Without Dismissing",
    body: "You can take an idea apart without taking a person apart. Say the harder thing, kindly.",
  },
  {
    title: "Everyone Participates",
    body: "Listening counts. Sitting back and observing the whole evening does not.",
  },
];

export const audience = {
  forYou: {
    heading: "You'll probably enjoy this if…",
    items: [
      "You are genuinely curious about how people work",
      "You read about psychology, behaviour or ideas for fun",
      "You want conversations that go past the first layer",
      "You are tired of rooms where everyone is quietly selling something",
      "You can hear a view you disagree with without needing to correct it",
    ],
  },
  notForYou: {
    heading: "This may not be for you if…",
    items: [
      "You are hoping to pitch something",
      "You want an audience more than a conversation",
      "You expect a speaker, slides and a takeaway framework",
      "You would rather be right than be interested",
      "You need your phone in your hand",
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
    q: "When is the next one?",
    a: "Not scheduled yet — the last conversation was 25 July 2026. Leave your email and you'll hear the moment a date is set, before it goes up on Meetup.",
  },
];

export const finalCta = {
  headline: { before: "Your feed can wait.", marked: "This conversation cannot." },
  body: "Two hours. One question. A room of strangers who came to think out loud. Leave your email and you'll be the first to know when the next date is set.",
  secondaryCta: { label: "See the community on Meetup", href: siteMeta.meetupUrl },
};

export const social = {
  instagram: siteMeta.instagram,
  meetup: siteMeta.meetupUrl,
  suggestTopic: "mailto:hello@socialnerds.in?subject=A%20topic%20worth%20a%20room",
  partnerVenue: "mailto:hello@socialnerds.in?subject=Our%20space%20could%20host%20this",
  contact: "mailto:hello@socialnerds.in",
  privacy: "/privacy",
};
