import Image from "next/image";
import {
  deleteGalleryItem,
  moveGalleryItem,
  setGalleryStatus,
  updateGalleryItem,
} from "../actions";
import ConfirmSubmit from "../ConfirmSubmit";

/**
 * One row per item. Plain forms with server actions rather than a client-side
 * editor: there is no state here worth hydrating for, and a form that works
 * without JavaScript is fewer things to go wrong in an admin nobody tests.
 */
export default function ItemRow({ item }) {
  const published = item.status === "published";

  return (
    <li className="card flex flex-col gap-4 p-4 text-ink sm:flex-row sm:items-start">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.thumb}
        alt={item.caption ?? ""}
        className="h-24 w-24 shrink-0 rounded-lg object-cover"
      />

      <form action={updateGalleryItem} className="flex flex-1 flex-col gap-2.5">
        <input type="hidden" name="id" value={item.id} />
        <input
          name="caption"
          defaultValue={item.caption ?? ""}
          placeholder="Caption (also the alt text)"
          className="w-full rounded-lg border border-ink/20 p-2 text-[0.875rem]"
        />
        <input
          name="meta"
          defaultValue={item.meta ?? ""}
          placeholder="Second line (optional)"
          className="w-full rounded-lg border border-ink/20 p-2 text-[0.875rem]"
        />
        <div className="flex flex-wrap items-center gap-2">
          <select
            name="span"
            defaultValue={item.span}
            className="w-full rounded-lg border border-ink/20 p-2 text-[0.8125rem] sm:w-auto"
          >
            <option value="normal">Normal (4:3)</option>
            <option value="wide">Wide (16:9)</option>
            <option value="tall">Tall (9:16)</option>
          </select>
          <select
            name="kind"
            defaultValue={item.kind}
            className="w-full rounded-lg border border-ink/20 p-2 text-[0.8125rem] sm:w-auto"
          >
            <option value="footage">Footage</option>
            <option value="poster">Poster</option>
          </select>
          <button type="submit" className="btn btn-ghost px-4 py-2 text-[0.8125rem]">
            Save
          </button>
        </div>
      </form>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-wider ${
            published ? "bg-green text-ivory" : "bg-ink/10 text-ink/70"
          }`}
        >
          {item.status}
        </span>

        <form action={setGalleryStatus.bind(null, item.id, published ? "draft" : "published")}>
          <button type="submit" className="btn btn-ghost px-3 py-2 text-[0.8125rem]">
            {published ? "Unpublish" : "Publish"}
          </button>
        </form>

        <form action={moveGalleryItem.bind(null, item.id, "up")}>
          <button type="submit" aria-label="Move up" className="btn btn-ghost px-3 py-2">
            ↑
          </button>
        </form>
        <form action={moveGalleryItem.bind(null, item.id, "down")}>
          <button type="submit" aria-label="Move down" className="btn btn-ghost px-3 py-2">
            ↓
          </button>
        </form>

        {/* Removes the Cloudinary asset as well as the row, so it arms first. */}
        <form action={deleteGalleryItem.bind(null, item.id)}>
          <ConfirmSubmit
            className="btn btn-ghost px-3 py-2 text-[0.8125rem] text-red-700"
            armedClassName="btn btn-ghost border-red-700 bg-red-700/10 px-3 py-2 text-[0.8125rem] text-red-800"
            confirmLabel="Delete for good"
          />
        </form>
      </div>
    </li>
  );
}
