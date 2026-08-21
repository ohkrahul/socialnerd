import Motion from "@/components/Motion";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import NextConversation from "@/components/NextConversation";
import HowItWorks from "@/components/HowItWorks";
import PastEvents from "@/components/PastEvents";
import Audience from "@/components/Audience";
import Faq from "@/components/Faq";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";
import StickyCta from "@/components/StickyCta";
import { isSignedIn } from "@/lib/auth";
import { getArchive, getEventForPreview, getFeaturedEvent } from "@/lib/events";

/**
 * Five sections, down from twelve.
 *
 *   1  Hero              the footage, the question, the one call to action
 *   2  Next conversation ONLY when one is scheduled — see below
 *   3  How it works      the four steps, plus what actually gets discussed
 *   4  Proof             real archive and the five checkable figures
 *   5  Honest            who it's for, who it isn't, and the questions people ask
 *   6  Close             one last ask
 *
 * Cut: topics as eight hover cards (the names were the information, the
 * interaction was decoration — now a row inside How It Works), the question
 * generator, the gallery (four tiles of two clips and a poster, and the hero
 * carries the real footage now), the house rules (the four steps already say
 * phones go in the box) and the standalone figures strip (folded into Proof).
 *
 * The empty "no date yet" event section is gone too: with nothing scheduled it
 * repeated the hero's own call to action a screen later. Now the section renders
 * only when there is a real event to show, and the hero handles the wait.
 */
export const revalidate = 3600;

export default async function Home({ searchParams }) {
  const { previewEvent } = await searchParams;

  // Drafts are visible only to a signed-in admin, and only when asked for.
  const preview =
    previewEvent && (await isSignedIn())
      ? await getEventForPreview(previewEvent)
      : null;

  const [featured, archive] = await Promise.all([
    preview ? Promise.resolve(preview) : getFeaturedEvent(),
    getArchive(),
  ]);

  return (
    <>
      <Motion />
      <Nav />

      {preview && (
        <p className="fixed inset-x-0 top-0 z-[80] bg-sand py-2 text-center text-[0.8125rem] font-semibold text-ink">
          Previewing a {preview.status} event. Only you can see this.
        </p>
      )}

      <main>
        <Hero />
        {featured && <NextConversation event={featured} />}
        <HowItWorks />
        <PastEvents events={archive} />
        <Audience />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <StickyCta event={featured} />
    </>
  );
}
