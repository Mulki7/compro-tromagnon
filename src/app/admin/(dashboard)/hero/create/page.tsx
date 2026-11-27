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
  formErrorClass,
  formSectionClass,
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
            <ArrowLeft size={15} aria-hidden="true" />
            Back
          </Link>
        }
      />
      <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-5 px-5 pb-12 pt-5 sm:px-7">
        {error && (
          <div role="alert" className={formErrorClass}>
            {error}
          </div>
        )}

        <div className={formSectionClass}>
          <ImageUpload
            label="Banner Image"
            value={bannerImage}
            onChange={setBannerImage}
          />

          <div>
            <label htmlFor="hero-title" className={labelClass}>Title</label>
            <input
              id="hero-title"
              required
              className={inputClass}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="hero-subtitle" className={labelClass}>Subtitle</label>
            <input
              id="hero-subtitle"
              className={inputClass}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="hero-cta-text" className={labelClass}>CTA Text</label>
              <input
                id="hero-cta-text"
                className={inputClass}
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="Explore Artists"
              />
            </div>
            <div>
              <label htmlFor="hero-cta-link" className={labelClass}>CTA Link</label>
              <input
                id="hero-cta-link"
                className={inputClass}
                value={ctaLink}
                onChange={(e) => setCtaLink(e.target.value)}
                placeholder="/artists"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="hero-order" className={labelClass}>Order</label>
              <input
                id="hero-order"
                type="number"
                min={0}
                className={inputClass}
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
              />
            </div>
            <div>
              <span className={labelClass}>Visibility</span>
              <label
                htmlFor="hero-active"
                className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-satelit-border bg-satelit-bg px-3.5 py-2.5 text-[14px] font-medium text-satelit-ink transition hover:border-satelit-accent"
              >
                <input
                  id="hero-active"
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-satelit-border accent-satelit-accent"
                />
                <span>Show on homepage</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2.5">
          <Link href="/admin/hero" className={btnSecondary}>
            Cancel
          </Link>
          <button type="submit" disabled={saving} className={btnPrimary}>
            {saving && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
            Create Banner
          </button>
        </div>
      </form>
    </div>
  );
}
