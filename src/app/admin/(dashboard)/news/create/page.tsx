"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { createNews } from "@/lib/api/admin/news";
import { Artist, Release } from "@/types/models";
import { slugify } from "@/lib/utils";

export default function CreateNewsPage() {
  const router = useRouter();
  const { onMenuClick } = useAdminShell();
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

  const submit = async (nextStatus: "draft" | "published") => {
    setSaving(true);
    setError(null);
    try {
      const res = await createNews({
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
      else setError(res.message || "Failed to create article");
    } catch (err) {
      setError(getErrorMessage(err, "Failed to create article"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminHeader
        title="Create News"
        subtitle="Write a dispatch"
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
          submit("draft");
        }}
        className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6"
      >
        {error && (
          <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4 border border-neutral-200 bg-white p-5">
          <ImageUpload label="Cover Image" value={cover} onChange={setCover} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Title</label>
              <input
                required
                className={inputClass}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!slugTouched) setSlug(slugify(e.target.value));
                }}
              />
            </div>
            <div>
              <label className={labelClass}>Slug</label>
              <input
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
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <Link href="/admin/news" className={btnSecondary}>
            Cancel
          </Link>
          <button
            type="button"
            disabled={saving || !title || !content}
            className={btnSecondary}
            onClick={() => submit("draft")}
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            Save as Draft
          </button>
          <button
            type="button"
            disabled={saving || !title || !content}
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
