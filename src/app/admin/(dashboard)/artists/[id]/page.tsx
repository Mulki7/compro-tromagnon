"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
  parseStringArray,
} from "@/components/admin/formStyles";
import { getAdminArtist, updateArtist } from "@/lib/api/admin/artists";
import { slugify } from "@/lib/utils";

export default function EditArtistPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { onMenuClick } = useAdminShell();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
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
  const [existingPhoto, setExistingPhoto] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const artist = await getAdminArtist(id);
        if (cancelled) return;
        if (!artist) {
          setError("Artist not found");
          return;
        }
        setName(artist.name);
        setSlug(artist.slug);
        setBio(artist.bio || "");
        setGenres(parseStringArray(artist.genre));
        setStatus(artist.status);
        setExistingPhoto(artist.photo_url || null);
        const sl = artist.social_links || {};
        setInstagram(sl.instagram || "");
        setSpotify(sl.spotify || "");
        setYoutube(sl.youtube || "");
        setTwitter(sl.twitter || "");
        setBandcamp(sl.bandcamp || "");
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err, "Failed to load artist"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const addGenre = () => {
    const g = genreInput.trim();
    if (g && !genres.includes(g)) setGenres([...genres, g]);
    setGenreInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await updateArtist(id, {
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
      if (res.success) {
        router.push("/admin/artists");
      } else {
        setError(res.message || "Failed to update artist");
      }
    } catch (err) {
      setError(getErrorMessage(err, "Failed to update artist"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-neutral-500">
        <Loader2 size={18} className="animate-spin" />
        <span className="font-mono text-xs uppercase">Loading…</span>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader
        title="Edit Artist"
        subtitle={name || "Update roster entry"}
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
          <ImageUpload
            label="Photo"
            value={photo}
            existingUrl={existingPhoto}
            onChange={setPhoto}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Name</label>
              <input
                required
                className={inputClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Slug</label>
              <input
                required
                className={inputClass}
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
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
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
