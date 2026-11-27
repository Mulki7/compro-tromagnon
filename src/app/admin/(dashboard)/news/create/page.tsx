"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import ImageUpload from "@/components/admin/ImageUpload";
import StatusBadge from "@/components/admin/StatusBadge";
import FormSummaryCard from "@/components/admin/FormSummaryCard";
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
import { getAdminArtists } from "@/lib/api/admin/artists";
import { getAdminReleases } from "@/lib/api/admin/releases";
import { createNews } from "@/lib/api/admin/news";
import { Artist, Release } from "@/types/models";
import { slugify } from "@/lib/utils";

export default function CreateNewsPage() {
  const router = useRouter();
  const { refreshShellData } = useAdminShell();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [releases, setReleases] = useState<Release[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("Tromagnon Records");
  const [relatedArtistId, setRelatedArtistId] = useState("");
  const [relatedReleaseId, setRelatedReleaseId] = useState("");
  const [cover, setCover] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getAdminArtists(), getAdminReleases()])
      .then(([a, r]) => {
        setArtists(a);
        setReleases(r);
      })
      .catch(() => setError("Failed to load related entities"));
  }, []);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  const submit = async (nextStatus: "draft" | "published") => {
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required before saving.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await createNews({
        title: title.trim(),
        slug: slug || slugify(title),
        content,
        author,
        related_artist_id: relatedArtistId || null,
        related_release_id: relatedReleaseId || null,
        status: nextStatus,
        cover,
      });
      if (res.success) {
        refreshShellData();
        router.push("/admin/news");
      } else {
        setError(res.message || "Failed to create article");
      }
    } catch (err) {
      setError(getErrorMessage(err, "Failed to create article"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pb-12">
      <AdminHeader
        backHref="/admin/news"
        backLabel="Journal"
        eyebrow="New editorial dispatch"
        title={title.trim() || "Write Article"}
        badge={<StatusBadge status="draft" />}
        actions={
          <Link href="/admin/news" className={btnSecondary}>
            Cancel
          </Link>
        }
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit("published");
        }}
        className="grid gap-5 px-4 sm:px-6 lg:grid-cols-12 lg:px-7"
      >
        <div className="space-y-5 lg:col-span-8">
          {error && (
            <div role="alert" className={formErrorClass}>
              {error}
            </div>
          )}

          <div className={formSectionClass}>
            <h2 className={formSectionTitleClass}>Editorial content</h2>
            <ImageUpload label="Cover Image" value={cover} onChange={setCover} />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="news-title" className={labelClass}>
                  Headline
                </label>
                <input
                  id="news-title"
                  required
                  placeholder="e.g. Satelit Compilation Vinyl Pre-Order"
                  className={inputClass}
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!slugTouched) setSlug(slugify(e.target.value));
                  }}
                />
              </div>
              <div>
                <label htmlFor="news-slug" className={labelClass}>
                  Slug
                </label>
                <input
                  id="news-slug"
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
              <label htmlFor="news-author" className={labelClass}>
                Author / Byline
              </label>
              <input
                id="news-author"
                className={inputClass}
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="news-content" className={labelClass}>
                Article Body
              </label>
              <textarea
                id="news-content"
                required
                rows={11}
                placeholder="Write label announcement, interview, or release dispatch..."
                className={inputClass}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>

          <div className={formSectionClass}>
            <div>
              <h2 className={formSectionTitleClass}>Catalog cross-links</h2>
              <p className="mt-0.5 text-[12.5px] text-admin-sub">
                Optionally associate this story with an artist or pressing
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="news-artist" className={labelClass}>
                  Related Artist
                </label>
                <select
                  id="news-artist"
                  className={inputClass}
                  value={relatedArtistId}
                  onChange={(e) => setRelatedArtistId(e.target.value)}
                >
                  <option value="">None</option>
                  {artists.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="news-release" className={labelClass}>
                  Related Release
                </label>
                <select
                  id="news-release"
                  className={inputClass}
                  value={relatedReleaseId}
                  onChange={(e) => setRelatedReleaseId(e.target.value)}
                >
                  <option value="">None</option>
                  {releases.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <FormSummaryCard
            title="Dispatch summary"
            subtitle={slug ? `/news/${slug}` : "New journal post"}
            rows={[
              { label: "Author", value: author || "Tromagnon" },
              { label: "Word count", value: `${wordCount} words` },
              {
                label: "Artist link",
                value: artists.find((a) => a.id === relatedArtistId)?.name || "None",
              },
              {
                label: "Release link",
                value: releases.find((r) => r.id === relatedReleaseId)?.title || "None",
              },
            ]}
            highlightLabel="Estimated read"
            highlightValue={`${Math.max(1, Math.ceil(wordCount / 200))} min`}
            warningText={
              !cover ? "Add a cover image to make this dispatch stand out." : undefined
            }
            submitLabel={saving ? "Publishing..." : "Publish Article"}
            saving={saving}
            onSecondaryAction={{
              label: "Save as Draft",
              onClick: () => submit("draft"),
            }}
            checks={[
              { label: "Cover image uploaded", done: Boolean(cover) },
              { label: "Headline & slug set", done: Boolean(title.trim() && slug.trim()) },
              { label: "Article body written", done: wordCount >= 15 },
            ]}
          />
        </div>
      </form>
    </div>
  );
}
