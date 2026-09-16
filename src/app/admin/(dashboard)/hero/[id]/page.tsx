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
import { getAdminHeroBanner, updateHeroBanner } from "@/lib/api/admin/hero";

export default function EditHeroPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { onMenuClick } = useAdminShell();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");
  const [order, setOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const banner = await getAdminHeroBanner(id);
        if (cancelled) return;
        if (!banner) {
          setError("Banner not found");
          return;
        }
        setTitle(banner.title);
        setSubtitle(banner.subtitle || "");
        setCtaText(banner.cta_text || "");
        setCtaLink(banner.cta_link || "");
        setOrder(banner.order ?? 1);
        setIsActive(banner.is_active !== false);
        setExistingImage(banner.image_url || null);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err, "Failed to load banner"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await updateHeroBanner(id, {
        title,
        subtitle,
        cta_text: ctaText,
        cta_link: ctaLink,
        order,
        is_active: isActive,
        banner_image: bannerImage,
      });
      if (res.success) router.push("/admin/hero");
      else setError(res.message || "Failed to update banner");
    } catch (err) {
      setError(getErrorMessage(err, "Failed to update banner"));
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
        title="Edit Banner"
        subtitle={title || "Update hero slide"}
        onMenuClick={onMenuClick}
        actions={
          <Link href="/admin/hero" className={btnSecondary}>
            <ArrowLeft size={14} />
            Back
          </Link>
        }
      />
      <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6 p-4 sm:p-6">
        {error && (
          <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4 border border-neutral-200 bg-white p-5">
          <ImageUpload
            label="Banner Image"
            value={bannerImage}
            existingUrl={existingImage}
            onChange={setBannerImage}
          />

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
            <label className={labelClass}>Subtitle</label>
            <input
              className={inputClass}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>CTA Text</label>
              <input
                className={inputClass}
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>CTA Link</label>
              <input
                className={inputClass}
                value={ctaLink}
                onChange={(e) => setCtaLink(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Order</label>
              <input
                type="number"
                min={0}
                className={inputClass}
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
              />
            </div>
            <div>
              <label className={labelClass}>Active</label>
              <label className="flex items-center gap-2 border border-neutral-200 bg-white px-3 py-2.5">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 accent-black"
                />
                <span className="font-mono text-xs uppercase">
                  Show on homepage
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Link href="/admin/hero" className={btnSecondary}>
            Cancel
          </Link>
          <button type="submit" disabled={saving} className={btnPrimary}>
            {saving && <Loader2 size={14} className="animate-spin" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
