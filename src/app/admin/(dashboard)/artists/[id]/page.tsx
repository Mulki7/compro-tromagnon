"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Plus, X } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import ImageUpload from "@/components/admin/ImageUpload";
import StatusBadge from "@/components/admin/StatusBadge";
import FormSummaryCard from "@/components/admin/FormSummaryCard";
import { SegmentedToggle } from "@/components/admin/ListControls";
import { useAdminShell } from "@/components/admin/AdminShellContext";
import {
  btnSecondary,
  formErrorClass,
  formLoadingClass,
  formSectionClass,
  formSectionTitleClass,
  getErrorMessage,
  inputClass,
  labelClass,
  parseStringArray,
  textareaClass,
} from "@/components/admin/formStyles";
import { getAdminArtist, updateArtist } from "@/lib/api/admin/artists";
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

export default function EditArtistPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { refreshShellData } = useAdminShell();
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

  const addGenre = (custom?: string) => {
    const g = (custom ?? genreInput).trim();
    if (g && !genres.includes(g)) setGenres([...genres, g]);
    if (!custom) setGenreInput("");
  };

  const socialCount = [instagram, spotify, youtube, twitter, bandcamp].filter(Boolean).length;
  const hasPhoto = Boolean(photo || existingPhoto);

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
        refreshShellData();
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
        <Loader2 size={18} className="animate-spin text-admin-forest" aria-hidden="true" />
        <span>Loading artist…</span>
      </div>
    );
  }

  return (
    <div className="pb-12">
      <AdminHeader
        backHref="/admin/artists"
        backLabel="Artists"
        title={name || "Edit artist"}
        badge={<StatusBadge status={status} />}
        actions={
          <Link href="/admin/artists" className={btnSecondary}>
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
              <h2 className={formSectionTitleClass}>Profile</h2>
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

            <ImageUpload
              label="Photo"
              value={photo}
              existingUrl={existingPhoto}
              onChange={setPhoto}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="artist-name" className={labelClass}>
                  Name
                </label>
                <input
                  id="artist-name"
                  required
                  className={inputClass}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="artist-slug" className={labelClass}>
                  Slug
                </label>
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
              <label htmlFor="artist-bio" className={labelClass}>
                Bio
              </label>
              <textarea
                id="artist-bio"
                required
                rows={4}
                className={textareaClass}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="artist-genre" className={labelClass}>
                Genres
              </label>
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
                <button
                  type="button"
                  className={btnSecondary}
                  onClick={() => addGenre()}
                >
                  Add
                </button>
              </div>

              {genres.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {genres.map((g) => (
                    <span
                      key={g}
                      className="inline-flex items-center gap-1.5 rounded-md bg-admin-forest-soft px-2.5 py-1 font-admin text-[12.5px] font-medium text-[#F1F2EE]"
                    >
                      {g}
                      <button
                        type="button"
                        onClick={() => setGenres(genres.filter((x) => x !== g))}
                        className="rounded p-0.5 text-[#DCE5E1] transition-colors duration-[120ms] hover:bg-admin-forest hover:text-white"
                        aria-label={`Remove ${g}`}
                      >
                        <X size={12} aria-hidden="true" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                {QUICK_GENRES.filter((g) => !genres.includes(g)).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => addGenre(g)}
                    className="inline-flex h-7 items-center gap-1 rounded-md border border-admin-border-strong bg-admin-canvas px-2.5 font-admin text-[12px] font-medium text-admin-ink transition-colors duration-[120ms] hover:bg-admin-elevated"
                  >
                    <span>{g}</span>
                    <Plus size={11} aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={formSectionClass}>
            <h2 className={formSectionTitleClass}>Social links</h2>
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
            title="Summary"
            subtitle={slug ? `/artists/${slug}` : undefined}
            rows={[
              { label: "Name", value: name || "—" },
              { label: "Genres", value: genres.join(", ") || "—" },
              { label: "Links", value: `${socialCount} / 5` },
            ]}
            highlightLabel="Status"
            highlightValue={status === "active" ? "Active" : "Archived"}
            warningText={!hasPhoto ? "No artist photo uploaded." : undefined}
            submitLabel={saving ? "Saving…" : "Save changes"}
            saving={saving}
            checks={[
              { label: "Photo", done: hasPhoto },
              { label: "Name & slug", done: Boolean(name.trim() && slug.trim()) },
              { label: "Bio", done: bio.trim().length > 10 },
              { label: "Genres", done: genres.length > 0 },
            ]}
          />
        </div>
      </form>
    </div>
  );
}
