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
} from "@/components/admin/formStyles";
import { getAdminArtists } from "@/lib/api/admin/artists";
import { getAdminReleases } from "@/lib/api/admin/releases";
import { getAdminNewsItem, updateNews } from "@/lib/api/admin/news";
import { Artist, Release } from "@/types/models";
import { slugify } from "@/lib/utils";

export default function EditNewsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { onMenuClick } = useAdminShell();
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
      if (res.success) router.push("/admin/news");
      else setError(res.message || "Failed to update article");
    } catch (err) {
      setError(getErrorMessage(err, "Failed to update article"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={formLoadingClass}>
        <Loader2 size={18} className="animate-spin text-satelit-accent" aria-hidden="true" />
        <span>Loading article…</span>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader
        title="Edit News"
        subtitle={title || "Update article"}
        onMenuClick={onMenuClick}
        actions={
          <Link href="/admin/news" className={btnSecondary}>
            <ArrowLeft size={15} aria-hidden="true" />
            Back
          </Link>
        }
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(status);
        }}
        className="mx-auto max-w-3xl space-y-5 px-5 pb-12 pt-5 sm:px-7"
      >
        {error && (
          <div role="alert" className={formErrorClass}>
            {error}
          </div>
        )}

        <div className={formSectionClass}>
          <ImageUpload
            label="Cover Image"
            value={cover}
            existingUrl={existingCover}
            onChange={setCover}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="news-title" className={labelClass}>Title</label>
              <input
                id="news-title"
                required
                className={inputClass}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="news-slug" className={labelClass}>Slug</label>
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
            <label htmlFor="news-author" className={labelClass}>Author</label>
            <input
              id="news-author"
              className={inputClass}
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="news-content" className={labelClass}>Content</label>
            <textarea
              id="news-content"
              required
              rows={11}
              className={inputClass}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="news-artist" className={labelClass}>Related Artist</label>
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
              <label htmlFor="news-release" className={labelClass}>Related Release</label>
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

          <div>
            <label htmlFor="news-status" className={labelClass}>Status</label>
            <select
              id="news-status"
              className={inputClass}
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "draft" | "published")
              }
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2.5">
          <Link href="/admin/news" className={btnSecondary}>
            Cancel
          </Link>
          <button
            type="button"
            disabled={saving}
            className={btnSecondary}
            onClick={() => submit("draft")}
          >
            {saving && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
            Save as Draft
          </button>
          <button
            type="button"
            disabled={saving}
            className={btnPrimary}
            onClick={() => submit("published")}
          >
            {saving && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
            Publish
          </button>
        </div>
      </form>
    </div>
  );
}
