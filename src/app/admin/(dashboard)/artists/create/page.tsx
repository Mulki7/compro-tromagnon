"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import ImageUpload from "@/components/admin/ImageUpload";
import StatusBadge from "@/components/admin/StatusBadge";
import FormSummaryCard from "@/components/admin/FormSummaryCard";
import { SegmentedToggle } from "@/components/admin/ListControls";
import { useAdminShell } from "@/components/admin/AdminShellContext";
import {
  btnSecondary,
  formErrorClass,
  formSectionClass,
  formSectionTitleClass,
  getErrorMessage,
  inputClass,
  labelClass,
} from "@/components/admin/formStyles";
import { createArtist } from "@/lib/api/admin/artists";
import { slugify } from "@/lib/utils";

const QUICK_GENRES = [
  "Indie Rock",
  "Shoegaze",
  "Post-Punk",
  "Ambient",
  "Dream Pop",
  "Alternative",
  "Electronic",
];

export default function CreateArtistPage() {
  const router = useRouter();
  const { refreshShellData } = useAdminShell();
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

  const addGenre = (custom?: string) => {
    const g = (custom ?? genreInput).trim();
    if (g && !genres.includes(g)) {
      setGenres([...genres, g]);
    }
    if (!custom) setGenreInput("");
  };

  const socialCount = [instagram, spotify, youtube, twitter, bandcamp].filter(Boolean).length;

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
        refreshShellData();
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
    <div className="pb-12">
      <AdminHeader
        backHref="/admin/artists"
        backLabel="Artists"
        eyebrow="New roster signing"
        title={name.trim() || "Add Artist"}
        badge={<StatusBadge status={status} />}
        actions={
          <Link href="/admin/artists" className={btnSecondary}>
            Cancel
          </Link>
        }
      />

      <form
        onSubmit={handleSubmit}
        className="grid gap-5 px-4 sm:px-6 lg:grid-cols-12 lg:px-7"
      >
        <div className="space-y-5 lg:col-span-8">
          {error && (
            <div role="alert" className={formErrorClass}>
              {error}
            </div>
          )}

          <div className={formSectionClass}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className={formSectionTitleClass}>Artist profile & press photo</h2>
              <SegmentedToggle
                ariaLabel="Artist roster status"
                value={status}
                onChange={setStatus}
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ]}
              />
            </div>

            <ImageUpload label="Artist Photo" value={photo} onChange={setPhoto} />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="artist-name" className={labelClass}>
                  Artist / Band Name
                </label>
                <input
                  id="artist-name"
                  required
                  placeholder="e.g. Blezja"
                  className={inputClass}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!slugTouched) setSlug(slugify(e.target.value));
                  }}
                />
              </div>
              <div>
                <label htmlFor="artist-slug" className={labelClass}>
                  URL Slug
                </label>
                <input
                  id="artist-slug"
                  required
                  placeholder="blezja"
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
              <label htmlFor="artist-bio" className={labelClass}>
                Artist Biography
              </label>
              <textarea
                id="artist-bio"
                required
                rows={5}
                placeholder="Write press bio, origin city, sonic direction..."
                className={inputClass}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="artist-genre" className={labelClass}>
                Genres & Sound Tags
              </label>
              <div className="flex gap-2">
                <input
                  id="artist-genre"
                  className={inputClass}
                  value={genreInput}
                  placeholder="Type a genre and press Enter"
                  onChange={(e) => setGenreInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addGenre();
                    }
                  }}
                />
                <button
                  type="button"
                  className={`${btnSecondary} h-auto px-5`}
                  onClick={() => addGenre()}
                >
                  Add
                </button>
              </div>

              {genres.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {genres.map((g) => (
                    <span
                      key={g}
                      className="inline-flex items-center gap-1.5 rounded-full bg-admin-forest px-3 py-1 text-[12.5px] font-semibold text-admin-lime"
                    >
                      {g}
                      <button
                        type="button"
                        onClick={() => setGenres(genres.filter((x) => x !== g))}
                        className="rounded-full p-0.5 text-white/80 transition hover:text-white"
                        aria-label={`Remove ${g}`}
                      >
                        <X size={13} aria-hidden="true" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="mr-1 text-[12px] font-medium text-admin-sub">
                  Quick add:
                </span>
                {QUICK_GENRES.filter((g) => !genres.includes(g)).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => addGenre(g)}
                    className="inline-flex items-center gap-1 rounded-full bg-admin-muted px-2.5 py-1 text-[12px] font-semibold text-admin-ink transition hover:bg-admin-lime-soft hover:text-admin-forest"
                  >
                    <span>{g}</span>
                    <Plus size={11} aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={formSectionClass}>
            <div>
              <h2 className={formSectionTitleClass}>Social & Listening Channels</h2>
              <p className="mt-0.5 text-[12.5px] text-admin-sub">
                Displayed on the public artist page and press kit
              </p>
            </div>
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
            title="Roster summary"
            subtitle={slug ? `/artists/${slug}` : "New artist profile"}
            rows={[
              { label: "Name", value: name || "Untitled artist" },
              { label: "Genres", value: genres.join(", ") || "Not tagged" },
              { label: "Channels", value: `${socialCount} / 5 linked` },
              { label: "Photo", value: photo ? "Ready to upload" : "Missing" },
            ]}
            highlightLabel="Roster status"
            highlightValue={status === "active" ? "Active Roster" : "Archived"}
            warningText={
              !photo
                ? "Add an artist press photo so they display cleanly on the roster."
                : undefined
            }
            submitLabel={saving ? "Creating..." : "Create Artist"}
            saving={saving}
            checks={[
              { label: "Press photo attached", done: Boolean(photo) },
              { label: "Name & slug set", done: Boolean(name.trim() && slug.trim()) },
              { label: "Biography written", done: bio.trim().length > 10 },
              { label: "Genre tags added", done: genres.length > 0 },
            ]}
          />
        </div>
      </form>
    </div>
  );
}
