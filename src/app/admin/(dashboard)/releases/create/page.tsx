"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import ImageUpload from "@/components/admin/ImageUpload";
import StatusBadge from "@/components/admin/StatusBadge";
import FormSummaryCard from "@/components/admin/FormSummaryCard";
import { SegmentedToggle } from "@/components/admin/ListControls";
import { useAdminShell } from "@/components/admin/AdminShellContext";
import {
  btnSecondary,
  editorialTextareaClass,
  formErrorClass,
  formSectionClass,
  formSectionTitleClass,
  getErrorMessage,
  inputClass,
  labelClass,
} from "@/components/admin/formStyles";
import { getAdminArtists } from "@/lib/api/admin/artists";
import { createRelease } from "@/lib/api/admin/releases";
import { Artist } from "@/types/models";
import { slugify } from "@/lib/utils";

const FORMATS = ["LP", "EP", "CD", "Digital", "Cassette"];

export default function CreateReleasePage() {
  const router = useRouter();
  const { refreshShellData } = useAdminShell();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [artistId, setArtistId] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());
  const [formats, setFormats] = useState<string[]>(["LP"]);
  const [description, setDescription] = useState("");
  const [spotify, setSpotify] = useState("");
  const [apple, setApple] = useState("");
  const [bandcamp, setBandcamp] = useState("");
  const [youtube, setYoutube] = useState("");
  const [status, setStatus] = useState<"published" | "draft">("draft");
  const [artwork, setArtwork] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAdminArtists()
      .then((list) => {
        setArtists(list);
        if (list[0]) setArtistId(list[0].id);
      })
      .catch(() => setError("Failed to load artists"));
  }, []);

  const toggleFormat = (f: string) => {
    setFormats((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  };

  const selectedArtist = artists.find((a) => a.id === artistId);
  const streamingCount = [spotify, apple, bandcamp, youtube].filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artistId) {
      setError("Please select an artist before saving.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await createRelease({
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
      if (res.success) {
        refreshShellData();
        router.push("/admin/releases");
      } else {
        setError(res.message || "Failed to create release");
      }
    } catch (err) {
      setError(getErrorMessage(err, "Failed to create release"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pb-12">
      <AdminHeader
        backHref="/admin/releases"
        backLabel="Releases"
        title={title.trim() || "New release"}
        badge={<StatusBadge status={status} />}
        actions={
          <Link href="/admin/releases" className={btnSecondary}>
            Cancel
          </Link>
        }
      />

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 px-4 sm:px-5 lg:grid-cols-12 lg:px-6"
      >
        <div className="space-y-4 lg:col-span-8">
          {error && (
            <div role="alert" className={formErrorClass}>
              {error}
            </div>
          )}

          <div className={formSectionClass}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className={formSectionTitleClass}>Details</h2>
              <SegmentedToggle
                ariaLabel="Release publish status"
                value={status}
                onChange={setStatus}
                options={[
                  { value: "draft", label: "Draft" },
                  { value: "published", label: "Published" },
                ]}
              />
            </div>

            <ImageUpload label="Artwork" value={artwork} onChange={setArtwork} />

            <div>
              <label htmlFor="release-artist" className={labelClass}>
                Artist
              </label>
              <select
                id="release-artist"
                required
                className={inputClass}
                value={artistId}
                onChange={(e) => setArtistId(e.target.value)}
              >
                <option value="">Select artist…</option>
                {artists.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="release-title" className={labelClass}>
                  Title
                </label>
                <input
                  id="release-title"
                  required
                  placeholder="e.g. Satelit Vol. 1"
                  className={inputClass}
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!slugTouched) setSlug(slugify(e.target.value));
                  }}
                />
              </div>
              <div>
                <label htmlFor="release-slug" className={labelClass}>
                  Slug
                </label>
                <input
                  id="release-slug"
                  required
                  placeholder="satelit-vol-1"
                  className={inputClass}
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(slugify(e.target.value));
                  }}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="release-year" className={labelClass}>
                  Year
                </label>
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

              <fieldset>
                <legend className={labelClass}>Formats</legend>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {FORMATS.map((f) => {
                    const selected = formats.includes(f);
                    return (
                      <button
                        key={f}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleFormat(f)}
                        className={`h-9 rounded-md border px-3 font-admin text-[13px] font-semibold transition-colors duration-[120ms] ${
                          selected
                            ? "border-admin-forest bg-admin-forest-soft text-[#F1F2EE]"
                            : "border-admin-border-strong bg-admin-canvas text-admin-ink hover:bg-admin-elevated"
                        }`}
                      >
                        {f}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            </div>

            <div>
              <label htmlFor="release-description" className={labelClass}>
                Description / Liner notes
              </label>
              <textarea
                id="release-description"
                required
                rows={4}
                placeholder="Release credits and notes…"
                className={editorialTextareaClass}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className={formSectionClass}>
            <h2 className={formSectionTitleClass}>Streaming links</h2>
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
                  <label htmlFor={fieldId} className={labelClass}>
                    {label}
                  </label>
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
        </div>

        <div className="lg:col-span-4">
          <FormSummaryCard
            title="Summary"
            subtitle={slug ? `/${slug}` : undefined}
            rows={[
              { label: "Artist", value: selectedArtist?.name || "—" },
              { label: "Year", value: String(year) },
              { label: "Formats", value: formats.join(", ") || "—" },
              { label: "Links", value: `${streamingCount} / 4` },
            ]}
            highlightLabel="Status"
            highlightValue={status === "published" ? "Published" : "Draft"}
            warningText={!artwork ? "No artwork uploaded yet." : undefined}
            submitLabel={saving ? "Saving…" : "Create release"}
            saving={saving}
            checks={[
              { label: "Artwork", done: Boolean(artwork) },
              { label: "Title & artist", done: Boolean(title.trim() && artistId) },
              { label: "Description", done: description.trim().length > 10 },
              { label: "Streaming link", done: streamingCount > 0 },
            ]}
          />
        </div>
      </form>
    </div>
  );
}
