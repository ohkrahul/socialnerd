import { requireAdmin } from "@/lib/auth";
import { getAllGalleryItems } from "@/lib/gallery";
import { cloudinaryIsConfigured } from "@/lib/cloudinary";
import UploadForm from "./UploadForm";
import ItemRow from "./ItemRow";

export const dynamic = "force-dynamic";

export default async function GalleryAdmin() {
  await requireAdmin();

  const configured = cloudinaryIsConfigured();
  const items = configured ? await getAllGalleryItems() : [];
  const footage = items.filter((i) => i.kind === "footage");
  const posters = items.filter((i) => i.kind === "poster");

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="question text-[clamp(1.45rem,6vw,2rem)]">Gallery</h1>
        <p className="t-dim mt-2 max-w-[42rem] text-[0.9375rem]">
          Anything published here replaces the built-in list on the homepage. With
          nothing published, the site falls back to the files in <code>public/</code>,
          so the section is never empty.
        </p>
      </div>

      {!configured ? (
        <div className="card p-6 text-ink">
          <p className="font-semibold">Cloudinary isn&apos;t configured.</p>
          <p className="mt-2 text-[0.875rem] text-ink/70">
            Set <code>CLOUDINARY_CLOUD_NAME</code>, <code>CLOUDINARY_API_KEY</code> and{" "}
            <code>CLOUDINARY_API_SECRET</code> in the environment, then reload. Until
            then the homepage uses the local fallback list.
          </p>
        </div>
      ) : (
        <>
          <UploadForm />

          <section>
            <h2 className="eyebrow t-faint">Footage — {footage.length}</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {footage.map((item) => (
                <ItemRow key={item.id} item={item} />
              ))}
              {footage.length === 0 && (
                <li className="t-dim text-[0.875rem]">Nothing yet.</li>
              )}
            </ul>
          </section>

          <section>
            <h2 className="eyebrow t-faint">Posters — {posters.length}</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {posters.map((item) => (
                <ItemRow key={item.id} item={item} />
              ))}
              {posters.length === 0 && (
                <li className="t-dim text-[0.875rem]">Nothing yet.</li>
              )}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
