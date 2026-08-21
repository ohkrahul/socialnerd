import Motion from "@/components/Motion";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import NextConversation from "@/components/NextConversation";
import HowItWorks from "@/components/HowItWorks";
import Gallery from "@/components/Gallery";
import Rules from "@/components/Rules";
import PastEvents from "@/components/PastEvents";
import Audience from "@/components/Audience";
import Faq from "@/components/Faq";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";
import StickyCta from "@/components/StickyCta";
import WhatsappFloat from "@/components/WhatsappFloat";
import { isSignedIn } from "@/lib/auth";
import { getArchive, getEventForPreview, getFeaturedEvent } from "@/lib/events";
import { getGallery, getPosters } from "@/lib/gallery";
import { getSiteSettings } from "@/lib/settings";

/**
 * Seven blocks, down from twelve, and weighted towards images over text.
 *
 *   1  Hero              the footage, the question, the one call to action
 *   2  Next conversation ONLY when one is scheduled
 *   3  How it works      four steps, plus what actually gets discussed
 *   4  Gallery           real clips, a real poster, and illustration
 *   5  House rules       four illustrated cards
 *   6  Proof             real archive and the five checkable figures
 *   7  Honest            who it's for, who it isn't, and the questions asked
 *      Close             one last ask, plus a way to just message a human
 *
 * Still cut: topics as eight hover cards (the names were the information and
 * the hover was decoration, so they are a plain row inside How It Works now),
 * the question generator, and the standalone figures strip, which is folded
 * into Proof as evidence for it.
 *
 * The empty "no date yet" event section is also gone: with nothing scheduled it
 * repeated the hero's own call to action a screen later. The section renders
 * only when there is a real event, and the hero handles the wait.
 */
export const revalidate = 3600;

export default async function Home({ searchParams }) {
  const { previewEvent } = await searchParams;

  // Drafts are visible only to a signed-in admin, and only when asked for.
  const preview =
    previewEvent && (await isSignedIn())
      ? await getEventForPreview(previewEvent)
      : null;

  const [featured, archive, galleryItems, posterItems, settings] = await Promise.all([
    preview ? Promise.resolve(preview) : getFeaturedEvent(),
    getArchive(),
    getGallery(),
    getPosters(),
    getSiteSettings(),
  ]);

  return (
    <>
      <Motion />
      <Nav members={settings.members} />

      {preview && (
        <p className="fixed inset-x-0 top-0 z-[80] bg-sand py-2 text-center text-[0.8125rem] font-semibold text-ink">
          Previewing a {preview.status} event. Only you can see this.
        </p>
      )}

      <main>
        <Hero indicators={settings.heroIndicators} />
        {featured && <NextConversation event={featured} />}
        <HowItWorks />
        <Gallery items={galleryItems} posters={posterItems} />
        <Rules />
        <PastEvents
          events={archive}
          stats={settings.stats}
          archiveNote={settings.archiveNote}
        />
        <Audience />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <StickyCta event={featured} />
      <WhatsappFloat />
    </>
  );
}
