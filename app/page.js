import Motion from "@/components/Motion";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import NextConversation from "@/components/NextConversation";
import HowItWorks from "@/components/HowItWorks";
import Topics from "@/components/Topics";
import QuestionGenerator from "@/components/QuestionGenerator";
import Gallery from "@/components/Gallery";
import Stats from "@/components/Stats";
import Rules from "@/components/Rules";
import PastEvents from "@/components/PastEvents";
import Audience from "@/components/Audience";
import Faq from "@/components/Faq";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";
import StickyCta from "@/components/StickyCta";
import { featuredEvent } from "@/lib/content";

/**
 * Section grounds alternate ink and ink-deep, with two deliberate ivory
 * inserts — the question generator and the who-this-is-for split. Dark is the
 * page's default and paper is the interruption, not the other way round.
 *
 * `featuredEvent` is null while nothing is scheduled, which is the real state.
 * In B3 this becomes getFeaturedEvent() reading from Postgres; every consumer
 * already handles null, so that swap touches this file only.
 */
export default function Home() {
  return (
    <>
      <Motion />
      <Nav />
      <main>
        <Hero />
        <NextConversation event={featuredEvent} />
        <HowItWorks />
        <Topics />
        <QuestionGenerator />
        <Gallery />
        <Stats />
        <Rules />
        <PastEvents />
        <Audience />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <StickyCta event={featuredEvent} />
    </>
  );
}
