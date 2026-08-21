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
import { isSignedIn } from "@/lib/auth";
import { getArchive, getEventForPreview, getFeaturedEvent } from "@/lib/events";

/**
 * Section grounds alternate ink and ink-deep, with two deliberate ivory
 * inserts — the question generator and the who-this-is-for split. Dark is the
 * page's default and paper is the interruption, not the other way round.
 *
 * Revalidated hourly rather than per-request: events change a few times a
 * month, and every admin action calls revalidatePath("/") anyway, so a publish
 * shows up immediately without making every visitor wait on a query.
 */
export const revalidate = 3600;

export default async function Home({ searchParams }) {
  const { previewEvent } = await searchParams;

  // Drafts are visible only to a signed-in admin, and only when asked for.
  const preview = previewEvent && (await isSignedIn())
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
        <NextConversation event={featured} />
        <HowItWorks />
        <Topics />
        <QuestionGenerator />
        <Gallery />
        <Stats />
        <Rules />
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
