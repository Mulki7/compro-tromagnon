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
  formErrorClass,
  formLoadingClass,
  formSectionClass,
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
      <div className={formLoadingClass}>
        <Loader2 size={18} className="animate-spin text-satelit-accent" aria-hidden="true" />
        <span>Loading artist…</span>
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
            <ArrowLeft size={15} aria-hidden="true" />
            Back
          </Link>
        }
      />
      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-5 px-5 pb-12 pt-5 sm:px-7">
        {error && (
          <div role="alert" className={formErrorClass}>
            {error}
          </div>
        )}

        <div className={formSectionClass}>
          <ImageUpload
            label="Photo"
            value={photo}
            existingUrl={existingPhoto}
            onChange={setPhoto}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="artist-name" className={labelClass}>Name</label>
              <input
                id="artist-name"
                required
                className={inputClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="artist-slug" className={labelClass}>Slug</label>
              <input
                id="artist-slug"
                required
                className={inputClass}
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label htmlFor="artist-bio" className={labelClass}>Bio</label>
            <textarea
              id="artist-bio"
              required
              rows={5}
              className={inputClass}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="artist-genre" className={labelClass}>Genre</label>
            <div className="flex gap-2">
              <input
                id="artist-genre"
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
              <div className="mt-2.5 flex flex-wrap gap-2">
                {genres.map((g) => (
                  <span
                    key={g}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-satelit-border bg-satelit-bg px-2.5 py-1 text-[13px] font-semibold text-satelit-ink"
                  >
                    {g}
                    <button
                      type="button"
                      onClick={() => setGenres(genres.filter((x) => x !== g))}
                      className="rounded p-0.5 text-satelit-muted transition hover:text-satelit-danger"
                      aria-label={`Remove ${g}`}
                    >
                      <X size={13} aria-hidden="true" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="artist-status" className={labelClass}>Status</label>
            <select
              id="artist-status"
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

        <div className={formSectionClass}>
          <h2 className="text-[15px] font-bold tracking-[-0.01em] text-satelit-ink">
            Social Links
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {(
              [
                ["social-instagram", "Instagram", instagram, setInstagram],
                ["social-spotify", "Spotify", spotify, setSpotify],
                ["social-youtube", "YouTube", youtube, setYoutube],
                ["social-twitter", "Twitter / X", twitter, setTwitter],
                ["social-bandcamp", "Bandcamp", bandcamp, setBandcamp],
              ] as const
            ).map(([fieldId, label, value, setter]) => (
              <div key={fieldId}>
                <label htmlFor={fieldId} className={labelClass}>{label}</label>
                <input
                  id={fieldId}
                  type="url"
                  className={inputClass}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  placeholder="https://"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2.5">
          <Link href="/admin/artists" className={btnSecondary}>
            Cancel
          </Link>
          <button type="submit" disabled={saving} className={btnPrimary}>
            {saving && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
