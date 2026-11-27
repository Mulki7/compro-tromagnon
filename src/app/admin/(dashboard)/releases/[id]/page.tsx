"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
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
import { getAdminArtists } from "@/lib/api/admin/artists";
import { getAdminRelease, updateRelease } from "@/lib/api/admin/releases";
import { Artist } from "@/types/models";
import { slugify } from "@/lib/utils";

const FORMATS = ["LP", "EP", "CD", "Digital", "Cassette"];

export default function EditReleasePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { onMenuClick } = useAdminShell();
  const [loading, setLoading] = useState(true);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [artistId, setArtistId] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [formats, setFormats] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [spotify, setSpotify] = useState("");
  const [apple, setApple] = useState("");
  const [bandcamp, setBandcamp] = useState("");
  const [youtube, setYoutube] = useState("");
  const [status, setStatus] = useState<"published" | "draft">("draft");
  const [artwork, setArtwork] = useState<File | null>(null);
  const [existingArt, setExistingArt] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [list, release] = await Promise.all([
          getAdminArtists(),
          getAdminRelease(id),
        ]);
        if (cancelled) return;
        setArtists(list);
        if (!release) {
          setError("Release not found");
          return;
        }
        setArtistId(release.artist_id);
        setTitle(release.title);
        setSlug(release.slug);
        setYear(release.release_year);
        setFormats(parseStringArray(release.format));
        setDescription(release.description || "");
        setStatus(release.status);
        setExistingArt(release.artwork_url || null);
        const sl = release.streaming_links || {};
        setSpotify(sl.spotify || "");
        setApple(sl.apple_music || "");
        setBandcamp(sl.bandcamp || "");
        setYoutube(sl.youtube_music || "");
      } catch (err) {
        if (!cancelled)
          setError(getErrorMessage(err, "Failed to load release"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const toggleFormat = (f: string) => {
    setFormats((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await updateRelease(id, {
        artist_id: artistId,
        title,
        slug: slug || slugify(title),
        release_year: year,
        format: formats,
        description,
        streaming_links: {
          spotify: spotify || undefined,
          apple_music: apple || undefined,
          bandcamp: bandcamp || undefined,
          youtube_music: youtube || undefined,
        },
        status,
        artwork,
      });
      if (res.success) router.push("/admin/releases");
      else setError(res.message || "Failed to update release");
    } catch (err) {
      setError(getErrorMessage(err, "Failed to update release"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={formLoadingClass}>
        <Loader2 size={18} className="animate-spin text-satelit-accent" aria-hidden="true" />
        <span>Loading release…</span>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader
        title="Edit Release"
        subtitle={title || "Update catalog entry"}
        onMenuClick={onMenuClick}
        actions={
          <Link href="/admin/releases" className={btnSecondary}>
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
            label="Artwork"
            value={artwork}
            existingUrl={existingArt}
            onChange={setArtwork}
          />

          <div>
            <label htmlFor="release-artist" className={labelClass}>Artist</label>
            <select
              id="release-artist"
              required
              className={inputClass}
              value={artistId}
              onChange={(e) => setArtistId(e.target.value)}
            >
              {artists.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="release-title" className={labelClass}>Title</label>
              <input
                id="release-title"
                required
                className={inputClass}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="release-slug" className={labelClass}>Slug</label>
              <input
                id="release-slug"
                required
                className={inputClass}
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="release-year" className={labelClass}>Release Year</label>
              <input
                id="release-year"
                type="number"
                required
                min={1900}
                max={2100}
                className={inputClass}
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              />
            </div>
            <div>
              <label htmlFor="release-status" className={labelClass}>Status</label>
              <select
                id="release-status"
                className={inputClass}
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "published" | "draft")
                }
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <fieldset>
            <legend className={labelClass}>Format</legend>
            <div className="flex flex-wrap gap-2">
              {FORMATS.map((f) => {
                const selected = formats.includes(f);
                return (
                  <button
                    key={f}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleFormat(f)}
                    className={`rounded-lg border px-3.5 py-1.5 text-[13px] font-semibold uppercase tracking-[0.06em] transition ${
                      selected
                        ? "border-satelit-accent bg-satelit-accent text-satelit-on-accent"
                        : "border-satelit-border bg-satelit-bg text-satelit-muted hover:border-satelit-accent hover:text-satelit-ink"
                    }`}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div>
            <label htmlFor="release-description" className={labelClass}>Description</label>
            <textarea
              id="release-description"
              required
              rows={5}
              className={inputClass}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className={formSectionClass}>
          <h2 className="text-[15px] font-bold tracking-[-0.01em] text-satelit-ink">
            Streaming Links
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {(
              [
                ["stream-spotify", "Spotify", spotify, setSpotify],
                ["stream-apple", "Apple Music", apple, setApple],
                ["stream-bandcamp", "Bandcamp", bandcamp, setBandcamp],
                ["stream-youtube", "YouTube Music", youtube, setYoutube],
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
          <Link href="/admin/releases" className={btnSecondary}>
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
