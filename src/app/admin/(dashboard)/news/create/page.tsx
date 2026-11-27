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
  textareaClass,
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
        title={title.trim() || "Write article"}
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
        className="grid gap-4 px-4 sm:px-5 lg:grid-cols-12 lg:px-6"
      >
        <div className="space-y-4 lg:col-span-8">
          {error && (
            <div role="alert" className={formErrorClass}>
              {error}
            </div>
          )}

          <div className={formSectionClass}>
            <h2 className={formSectionTitleClass}>Article</h2>
            <ImageUpload label="Cover image" value={cover} onChange={setCover} />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="news-title" className={labelClass}>
                  Headline
                </label>
                <input
                  id="news-title"
                  required
                  placeholder="Article title"
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
                Author
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
                Content
              </label>
              <textarea
                id="news-content"
                required
                rows={9}
                placeholder="Write article…"
                className={textareaClass}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>

          <div className={formSectionClass}>
            <h2 className={formSectionTitleClass}>Related</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="news-artist" className={labelClass}>
                  Artist
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
                  Release
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
            title="Summary"
            subtitle={slug ? `/news/${slug}` : undefined}
            rows={[
              { label: "Author", value: author || "Tromagnon" },
              { label: "Words", value: String(wordCount) },
              {
                label: "Artist",
                value: artists.find((a) => a.id === relatedArtistId)?.name || "—",
              },
              {
                label: "Release",
                value: releases.find((r) => r.id === relatedReleaseId)?.title || "—",
              },
            ]}
            highlightLabel="Read time"
            highlightValue={`${Math.max(1, Math.ceil(wordCount / 200))} min`}
            warningText={!cover ? "No cover image yet." : undefined}
            submitLabel={saving ? "Publishing…" : "Publish"}
            saving={saving}
            onSecondaryAction={{
              label: "Save draft",
              onClick: () => submit("draft"),
            }}
            checks={[
              { label: "Cover image", done: Boolean(cover) },
              { label: "Headline & slug", done: Boolean(title.trim() && slug.trim()) },
              { label: "Content", done: wordCount >= 15 },
            ]}
          />
        </div>
      </form>
    </div>
  );
}
