"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, X } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import ImageUpload from "@/components/admin/ImageUpload";
import { useAdminShell } from "@/components/admin/AdminShellContext";
import {
  btnPrimary,
  btnSecondary,
  getErrorMessage,
  inputClass,
  labelClass,
} from "@/components/admin/formStyles";
import { createArtist } from "@/lib/api/admin/artists";
import { slugify } from "@/lib/utils";

export default function CreateArtistPage() {
  const router = useRouter();
  const { onMenuClick } = useAdminShell();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [bio, setBio] = useState("");
  const [genreInput, setGenreInput] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [instagram, setInstagram] = useState("");
  const [spotify, setSpotify] = useState("");
  const [youtube, setYoutube] = useState("");
  const [twitter, setTwitter] = useState("");
  const [bandcamp, setBandcamp] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [photo, setPhoto] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addGenre = () => {
    const g = genreInput.trim();
    if (g && !genres.includes(g)) {
      setGenres([...genres, g]);
    }
    setGenreInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await createArtist({
        name,
        slug: slug || slugify(name),
        bio,
        genre: genres,
        social_links: {
          instagram: instagram || undefined,
          spotify: spotify || undefined,
          youtube: youtube || undefined,
          twitter: twitter || undefined,
          bandcamp: bandcamp || undefined,
        },
        status,
        photo,
      });
      if (res.success && res.data?.id) {
        router.push("/admin/artists");
      } else {
        setError(res.message || "Failed to create artist");
      }
    } catch (err) {
      setError(getErrorMessage(err, "Failed to create artist"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminHeader
        title="Add Artist"
        subtitle="Create roster entry"
        onMenuClick={onMenuClick}
        actions={
          <Link href="/admin/artists" className={btnSecondary}>
            <ArrowLeft size={14} />
            Back
          </Link>
        }
      />
      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
        {error && (
          <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4 border border-neutral-200 bg-white p-5">
          <ImageUpload label="Photo" value={photo} onChange={setPhoto} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Name</label>
              <input
                required
                className={inputClass}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!slugTouched) setSlug(slugify(e.target.value));
                }}
              />
            </div>
            <div>
              <label className={labelClass}>Slug</label>
              <input
                required
                className={inputClass}
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(slugify(e.target.value));
                }}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Bio</label>
            <textarea
              required
              rows={5}
              className={inputClass}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>Genre</label>
            <div className="flex gap-2">
              <input
                className={inputClass}
                value={genreInput}
                placeholder="Type genre and press Enter"
                onChange={(e) => setGenreInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addGenre();
                  }
                }}
              />
              <button type="button" className={btnSecondary} onClick={addGenre}>
                Add
              </button>
            </div>
            {genres.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {genres.map((g) => (
                  <span
                    key={g}
                    className="inline-flex items-center gap-1 border border-neutral-200 bg-neutral-50 px-2 py-1 font-mono text-[10px] uppercase"
                  >
                    {g}
                    <button
                      type="button"
                      onClick={() => setGenres(genres.filter((x) => x !== g))}
                      aria-label={`Remove ${g}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className={labelClass}>Status</label>
            <select
              className={inputClass}
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "active" | "inactive")
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="space-y-4 border border-neutral-200 bg-white p-5">
          <p className={labelClass}>Social Links</p>
          {(
            [
              ["Instagram", instagram, setInstagram],
              ["Spotify", spotify, setSpotify],
              ["YouTube", youtube, setYoutube],
              ["Twitter / X", twitter, setTwitter],
              ["Bandcamp", bandcamp, setBandcamp],
            ] as const
          ).map(([label, value, setter]) => (
            <div key={label}>
              <label className={labelClass}>{label}</label>
              <input
                type="url"
                className={inputClass}
                value={value}
                onChange={(e) => setter(e.target.value)}
                placeholder="https://"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <Link href="/admin/artists" className={btnSecondary}>
            Cancel
          </Link>
          <button type="submit" disabled={saving} className={btnPrimary}>
            {saving && <Loader2 size={14} className="animate-spin" />}
            Create Artist
          </button>
        </div>
      </form>
    </div>
  );
}
