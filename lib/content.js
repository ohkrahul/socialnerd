/**
 * Placeholder content, shaped exactly like the Payload collections it will
 * come from in phase 2. Field names here === field names there, so swapping
 * this file for `payload.find()` calls is a data-fetch change only — no
 * component touches required.
 *
 * Payload mapping:
 *   hero, stats, siteMeta, social  -> globals (single-instance)
 *   events (featured + past)       -> collection `events`
 *   topics, questions, testimonials, rules, faqs, gallery -> collections
 */

export const siteMeta = {
  name: "Social Nerds",
  tagline: "Less scrolling. More thinking. Better conversations.",
  description:
    "Social Nerds brings curious people together for honest, thoughtful and screen-free conversations in Mumbai.",
  city: "Mumbai",
};

export const nav = [
  { label: "Conversations", href: "#conversations" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Community", href: "#community" },
  { label: "About", href: "#about" },
  { label: "FAQ", href: "#faq" },
];

export const hero = {
  eyebrow: "A community for curious minds",
  headlineLines: ["Less scrolling.", "More thinking."],
  headlineAccent: "Better conversations.",
  body: "Social Nerds brings curious people together for honest, thoughtful and screen-free conversations in Mumbai.",
  primaryCta: { label: "Reserve Your Seat", href: "#conversations" },
  secondaryCta: { label: "Explore Social Nerds", href: "#how-it-works" },
  indicators: ["Mumbai", "Screen-free", "Real people", "Real conversations"],
  image: { src: "/media/meetup-01.jpg", alt: "Fourteen people mid-conversation, seated in a circle" },
  // Positioned as percentages of the image frame so they stay put on resize.
  bubbles: [
    { text: "Are we really listening?", x: 8, y: 14 },
    { text: "What belief changed your life?", x: 46, y: 5 },
    { text: "Can discomfort be useful?", x: 4, y: 66 },
    { text: "What makes us emotionally intelligent?", x: 40, y: 80 },
  ],
};

export const featuredEvent = {
  status: "published",
  label: "Upcoming Conversation",
  title: "Are You Emotionally Intelligent?",
  subtitle: "Knowing the vocabulary is not the same as practising empathy.",
  description:
    "We all know the words — boundaries, projection, self-awareness. This one asks a harder question: when did you last use them on yourself? Four hours, one room, no slides.",
  date: "Saturday, 6 September 2026",
  time: "5:00 PM — 8:00 PM",
  venue: "Subko Coffee Roasters, Bandra West",
  fee: 299,
  capacity: 18,
  seatsRemaining: 5,
  host: "Aarav & Nidhi",
  meetupUrl: "https://www.meetup.com/",
  calendarUrl: "#",
};

export const pastEvents = [
  {
    title: "The Anxiety Generation",
    date: "9 August 2026",
    venue: "Bombay Coffee House, Khar",
    attendance: 16,
    question: "Is our anxiety a malfunction, or a reasonable response?",
    recapUrl: "#",
  },
  {
    title: "What Does Success Really Mean?",
    date: "12 July 2026",
    venue: "The Nutcracker, Fort",
    attendance: 18,
    question: "Whose definition of success are you living inside?",
    recapUrl: "#",
  },
  {
    title: "Love in the Modern World",
    date: "14 June 2026",
    venue: "Kala Ghoda Café, Fort",
    attendance: 15,
    question: "Have we confused being chosen with being loved?",
    recapUrl: "#",
  },
  {
    title: "Are You Emotionally Intelligent?",
    date: "10 May 2026",
    venue: "Subko, Bandra West",
    attendance: 14,
    question: "Can you name the feeling before you act on it?",
    recapUrl: "#",
  },
];

export const steps = [
  {
    title: "You arrive as you are",
    body: "No introductions by job title. No elevator pitch. Just your name and whatever you turned up thinking about.",
  },
  {
    title: "Phones disappear",
    body: "Everything goes into a box by the door. For the next few hours nobody can look something up, or look away.",
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

export const gallery = [
  { type: "image", src: "/media/meetup-01.jpg", caption: "Nine strangers, one question", span: "tall" },
  { type: "video", src: "/video/loop-02.mp4", caption: "A thought being reconsidered", span: "wide" },
  { type: "image", src: "/media/meetup-02.jpg", caption: "No slides. No lectures.", span: "normal" },
  { type: "video", src: "/video/loop-03.mp4", caption: "Someone changed their mind here", span: "normal" },
  // A note tile stands in for the handwriting shots until they're photographed.
  { type: "note", note: "I think I have been listening to reply.", caption: "Left on a napkin, Conversation No. 22", span: "normal" },
  { type: "video", src: "/video/loop-01.mp4", caption: "The room, twenty minutes in", span: "wide" },
];

export const stats = [
  { value: "110+", label: "Curious Minds" },
  { value: "25+", label: "Conversations Held" },
  { value: "Mumbai", label: "Our Home" },
  { value: "5.0", label: "Meetup Rating" },
  { value: "100%", label: "Screen-Free" },
];

export const testimonials = [
  {
    quote: "I arrived expecting networking. I left questioning an opinion I had held for years.",
    name: "Ishita R.",
    profession: "Product designer",
    event: "The Anxiety Generation",
  },
  {
    quote: "For two hours, nobody asked me what I did for work. It felt incredibly refreshing.",
    name: "Karan M.",
    profession: "Doctor",
    event: "What Does Success Really Mean?",
  },
  {
    quote: "I felt safe disagreeing with people without the conversation becoming hostile.",
    name: "Ananya S.",
    profession: "Journalist",
    event: "Love in the Modern World",
  },
  {
    quote: "I came alone and spent the first ten minutes regretting it. By the end I had three numbers and a book list.",
    name: "Rohan D.",
    profession: "Founder",
    event: "Are You Emotionally Intelligent?",
  },
];

export const rules = [
  {
    title: "Phones Away",
    body: "In the box by the door. A conversation where anyone can leave at any moment is not really a conversation.",
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
    heading: "You'll probably enjoy Social Nerds if…",
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

export const faqs = [
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
    a: "You will want to, eventually. Nobody is put on the spot, and nobody is called on. But sitting silently for three hours is not really participating, and the room will gently make space for you.",
  },
  {
    q: "Can I attend alone?",
    a: "Most people do. It is genuinely easier alone — you are not managing anyone else's evening.",
  },
  {
    q: "Is there an entry fee?",
    a: "₹299, which covers the venue and one drink. It also means the people who show up meant to.",
  },
  {
    q: "Where are the conversations conducted?",
    a: "Cafés and small spaces across Mumbai — mostly Bandra, Khar and Fort. The exact venue is confirmed with your booking.",
  },
  {
    q: "Are phones prohibited?",
    a: "They go in a box by the door for the duration. You get them back. If you are on call for work or family, tell the host and we'll make an exception.",
  },
  {
    q: "How do I reserve my seat?",
    a: "Through the Meetup link on the upcoming conversation above. Rooms cap at eighteen, and they usually fill within a week.",
  },
];

export const finalCta = {
  headlineLines: ["Your feed can wait.", "This conversation cannot."],
  body: "Walk into a room of strangers. Leave with new questions, new perspectives and perhaps a few real connections.",
  primaryCta: { label: "Reserve Your Seat", href: "#conversations" },
  secondaryCta: { label: "Join the WhatsApp Community", href: "#" },
};

export const social = {
  instagram: "https://instagram.com/",
  meetup: "https://www.meetup.com/",
  whatsapp: "#",
  suggestTopic: "#",
  partnerVenue: "#",
  contact: "mailto:hello@socialnerds.in",
  privacy: "#",
};
