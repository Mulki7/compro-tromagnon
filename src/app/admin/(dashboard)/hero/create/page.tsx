"use client";

import { useState } from "react";
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
import { createHeroBanner } from "@/lib/api/admin/hero";

export default function CreateHeroPage() {
  const router = useRouter();
  const { onMenuClick } = useAdminShell();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");
  const [order, setOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await createHeroBanner({
        title,
        subtitle,
        cta_text: ctaText,
        cta_link: ctaLink,
        order,
        is_active: isActive,
        banner_image: bannerImage,
      });
      if (res.success) router.push("/admin/hero");
      else setError(res.message || "Failed to create banner");
    } catch (err) {
      setError(getErrorMessage(err, "Failed to create banner"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminHeader
        title="Add Banner"
        subtitle="Homepage hero slide"
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
                placeholder="Explore Artists"
              />
            </div>
            <div>
              <label className={labelClass}>CTA Link</label>
              <input
                className={inputClass}
                value={ctaLink}
                onChange={(e) => setCtaLink(e.target.value)}
                placeholder="/artists"
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
            Create Banner
          </button>
        </div>
      </form>
    </div>
  );
}
