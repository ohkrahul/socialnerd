import Motion from "@/components/Motion";
import Thread from "@/components/Thread";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import UpcomingEvent from "@/components/UpcomingEvent";
import HowItWorks from "@/components/HowItWorks";
import Topics from "@/components/Topics";
import QuestionGenerator from "@/components/QuestionGenerator";
import Gallery from "@/components/Gallery";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import Rules from "@/components/Rules";
import PastEvents from "@/components/PastEvents";
import Audience from "@/components/Audience";
import Faq from "@/components/Faq";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";
import StickyCta from "@/components/StickyCta";

export default function Home() {
  return (
    <>
      <Motion />
      <Nav />
      <div className="relative">
        <Thread />
        <main>
          <Hero />
          <UpcomingEvent />
          <HowItWorks />
          <Topics />
          <QuestionGenerator />
          <Gallery />
          <Stats />
          <Testimonials />
          <Rules />
          <PastEvents />
          <Audience />
          <Faq />
          <FinalCta />
        </main>
        <Footer />
      </div>
      <StickyCta />
    </>
  );
}
