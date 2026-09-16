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
    setSaving(true);
    setError(null);
    try {
      const res = await updateNews(id, {
        title,
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
      <div className="flex items-center justify-center gap-2 py-24 text-neutral-500">
        <Loader2 size={18} className="animate-spin" />
        <span className="font-mono text-xs uppercase">Loading…</span>
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
            <ArrowLeft size={14} />
            Back
          </Link>
        }
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(status);
        }}
        className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6"
      >
        {error && (
          <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4 border border-neutral-200 bg-white p-5">
          <ImageUpload
            label="Cover Image"
            value={cover}
            existingUrl={existingCover}
            onChange={setCover}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Title</label>
              <input
                required
                className={inputClass}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
            <label className={labelClass}>Author</label>
            <input
              className={inputClass}
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>Content</label>
            <textarea
              required
              rows={12}
              className={inputClass}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Related Artist</label>
              <select
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
              <label className={labelClass}>Related Release</label>
              <select
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
            <label className={labelClass}>Status</label>
            <select
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

        <div className="flex flex-wrap justify-end gap-2">
          <Link href="/admin/news" className={btnSecondary}>
            Cancel
          </Link>
          <button
            type="button"
            disabled={saving}
            className={btnSecondary}
            onClick={() => submit("draft")}
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            Save as Draft
          </button>
          <button
            type="button"
            disabled={saving}
            className={btnPrimary}
            onClick={() => submit("published")}
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            Publish
          </button>
        </div>
      </form>
    </div>
  );
}
