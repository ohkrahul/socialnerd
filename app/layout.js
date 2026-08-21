import { Instrument_Serif, Manrope, Anton } from "next/font/google";
import "./globals.css";
import { siteMeta } from "@/lib/content";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument-serif",
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

// The room's voice. Heavy condensed caps, matching the community's own event
// posters. Used only on questions, never on body copy.
const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-anton",
});

export const metadata = {
  metadataBase: new URL("https://socialnerds.in"),
  title: {
    default: "Social Nerds — Screen-free conversations in Mumbai",
    template: "%s · Social Nerds",
  },
  description: siteMeta.description,
  keywords: [
    "Social Nerds",
    "Mumbai community",
    "screen-free meetups",
    "emotional intelligence",
    "meaningful conversations Mumbai",
    "Chembur meetup",
    "things to do in Mumbai",
  ],
  openGraph: {
    title: "Social Nerds",
    description: siteMeta.description,
    url: "https://socialnerds.in",
    siteName: "Social Nerds",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Social Nerds",
    description: siteMeta.description,
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#2A3B2F",
};

// Sets the pre-reveal state before first paint so nothing flashes visible and
// then hides. Skipped entirely when the visitor prefers reduced motion.
const noFlash = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('anim')}}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en-IN"
      className={`${instrumentSerif.variable} ${manrope.variable} ${anton.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlash }} />
      </head>
      <body className="grain">{children}</body>
    </html>
  );
}
