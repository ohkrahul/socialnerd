import { Instrument_Serif, Manrope, JetBrains_Mono } from "next/font/google";
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

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const metadata = {
  metadataBase: new URL("https://socialnerds.in"),
  title: {
    default: "Social Nerds — Less scrolling. More thinking. Better conversations.",
    template: "%s · Social Nerds",
  },
  description: siteMeta.description,
  keywords: [
    "Social Nerds",
    "Mumbai community",
    "screen-free meetups",
    "emotional intelligence",
    "meaningful conversations Mumbai",
  ],
  openGraph: {
    title: "Social Nerds",
    description: siteMeta.description,
    url: "https://socialnerds.in",
    siteName: "Social Nerds",
    locale: "en_IN",
    type: "website",
    images: [{ url: "/media/meetup-01.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Social Nerds",
    description: siteMeta.description,
  },
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
      className={`${instrumentSerif.variable} ${manrope.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlash }} />
      </head>
      <body className="grain">{children}</body>
    </html>
  );
}
