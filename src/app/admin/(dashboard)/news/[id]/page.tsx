"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
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
  formLoadingClass,
  formSectionClass,
  formSectionTitleClass,
  getErrorMessage,
  inputClass,
  labelClass,
} from "@/components/admin/formStyles";
import { getAdminArtists } from "@/lib/api/admin/artists";
import { getAdminReleases } from "@/lib/api/admin/releases";
import { getAdminNewsItem, updateNews } from "@/lib/api/admin/news";
import { Artist, Release } from "@/types/models";
import { slugify } from "@/lib/utils";

export default function EditNewsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { refreshShellData } = useAdminShell();
  const [loading, setLoading] = useState(true);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [releases, setReleases] = useState<Release[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [relatedArtistId, setRelatedArtistId] = useState("");
  const [relatedReleaseId, setRelatedReleaseId] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [cover, setCover] = useState<File | null>(null);
  const [existingCover, setExistingCover] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [a, r, item] = await Promise.all([
          getAdminArtists(),
          getAdminReleases(),
          getAdminNewsItem(id),
        ]);
        if (cancelled) return;
        setArtists(a);
        setReleases(r);
        if (!item) {
          setError("Article not found");
          return;
        }
        setTitle(item.title);
        setSlug(item.slug);
        setContent(item.content || "");
        setAuthor(item.author || "");
        setRelatedArtistId(item.related_artist_id || "");
        setRelatedReleaseId(item.related_release_id || "");
        setStatus(item.status);
        setExistingCover(item.cover_image_url || null);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err, "Failed to load article"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const hasCover = Boolean(cover || existingCover);

  const submit = async (nextStatus: "draft" | "published") => {
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required before saving.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await updateNews(id, {
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
        setError(res.message || "Failed to update article");
      }
    } catch (err) {
      setError(getErrorMessage(err, "Failed to update article"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={formLoadingClass}>
        <Loader2 size={18} className="animate-spin text-admin-forest" aria-hidden="true" />
        <span>Loading article…</span>
      </div>
    );
  }

  return (
    <div className="pb-12">
      <AdminHeader
        backHref="/admin/news"
        backLabel="Journal"
        title={title || "Edit article"}
        badge={<StatusBadge status={status} />}
        actions={
          <Link href="/admin/news" className={btnSecondary}>
            Cancel
          </Link>
        }
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(status);
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
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className={formSectionTitleClass}>Article</h2>
              <SegmentedToggle
                ariaLabel="Article publish status"
                value={status}
                onChange={setStatus}
                options={[
                  { value: "draft", label: "Draft" },
                  { value: "published", label: "Published" },
                ]}
              />
            </div>

            <ImageUpload
              label="Cover image"
              value={cover}
              existingUrl={existingCover}
              onChange={setCover}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="news-title" className={labelClass}>
                  Headline
                </label>
                <input
                  id="news-title"
                  required
                  className={inputClass}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                  onChange={(e) => setSlug(slugify(e.target.value))}
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
                className={editorialTextareaClass}
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
            highlightLabel="Status"
            highlightValue={status === "published" ? "Published" : "Draft"}
            warningText={!hasCover ? "No cover image uploaded." : undefined}
            submitLabel={saving ? "Saving…" : "Save changes"}
            saving={saving}
            onSecondaryAction={
              status === "draft"
                ? {
                    label: "Publish now",
                    onClick: () => submit("published"),
                  }
                : {
                    label: "Move to draft",
                    onClick: () => submit("draft"),
                  }
            }
            checks={[
              { label: "Cover image", done: hasCover },
              { label: "Headline & slug", done: Boolean(title.trim() && slug.trim()) },
              { label: "Content", done: wordCount >= 15 },
            ]}
          />
        </div>
      </form>
    </div>
  );
}
