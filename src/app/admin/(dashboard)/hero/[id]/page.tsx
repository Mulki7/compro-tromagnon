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
  formErrorClass,
  formLoadingClass,
  formSectionClass,
  formSectionTitleClass,
  getErrorMessage,
  inputClass,
  labelClass,
} from "@/components/admin/formStyles";
import { getAdminHeroBanner, updateHeroBanner } from "@/lib/api/admin/hero";

export default function EditHeroPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { refreshShellData } = useAdminShell();
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

  const hasImage = Boolean(bannerImage || existingImage);

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
      if (res.success) {
        refreshShellData();
        router.push("/admin/hero");
      } else {
        setError(res.message || "Failed to update banner");
      }
    } catch (err) {
      setError(getErrorMessage(err, "Failed to update banner"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={formLoadingClass}>
        <Loader2 size={18} className="animate-spin text-admin-forest" aria-hidden="true" />
        <span>Loading banner…</span>
      </div>
    );
  }

  return (
    <div className="pb-12">
      <AdminHeader
        backHref="/admin/hero"
        backLabel="Hero Banners"
        eyebrow={`Slide order #${order}`}
        title={title || "Edit Banner"}
        badge={<StatusBadge status={String(isActive)} />}
        actions={
          <Link href="/admin/hero" className={btnSecondary}>
            Cancel
          </Link>
        }
      />

      <form
        onSubmit={handleSubmit}
        className="grid gap-5 px-4 sm:px-6 lg:grid-cols-12 lg:px-7"
      >
        <div className="space-y-5 lg:col-span-8">
          {error && (
            <div role="alert" className={formErrorClass}>
              {error}
            </div>
          )}

          <div className={formSectionClass}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className={formSectionTitleClass}>Hero visual & copy</h2>
              <SegmentedToggle
                ariaLabel="Banner homepage visibility"
                value={isActive ? "active" : "hidden"}
                onChange={(v) => setIsActive(v === "active")}
                options={[
                  { value: "active", label: "Visible" },
                  { value: "hidden", label: "Hidden" },
                ]}
              />
            </div>

            <ImageUpload
              label="Banner Image"
              value={bannerImage}
              existingUrl={existingImage}
              onChange={setBannerImage}
            />

            <div>
              <label htmlFor="hero-title" className={labelClass}>
                Headline
              </label>
              <input
                id="hero-title"
                required
                className={inputClass}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="hero-subtitle" className={labelClass}>
                Subtitle / Caption
              </label>
              <input
                id="hero-subtitle"
                className={inputClass}
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="hero-cta-text" className={labelClass}>
                  CTA Label
                </label>
                <input
                  id="hero-cta-text"
                  className={inputClass}
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="Explore Releases"
                />
              </div>
              <div>
                <label htmlFor="hero-cta-link" className={labelClass}>
                  CTA Destination
                </label>
                <input
                  id="hero-cta-link"
                  className={inputClass}
                  value={ctaLink}
                  onChange={(e) => setCtaLink(e.target.value)}
                  placeholder="/releases"
                />
              </div>
              <div>
                <label htmlFor="hero-order" className={labelClass}>
                  Slide Order
                </label>
                <input
                  id="hero-order"
                  type="number"
                  min={0}
                  className={inputClass}
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <FormSummaryCard
            title="Slide summary"
            subtitle={`Homepage slot #${order}`}
            rows={[
              { label: "Headline", value: title || "Untitled slide" },
              { label: "CTA Button", value: ctaText || "None" },
              { label: "Target Link", value: ctaLink || "None" },
              { label: "Sort Order", value: `#${order}` },
            ]}
            highlightLabel="Visibility"
            highlightValue={isActive ? "Live on Home" : "Hidden"}
            warningText={
              !hasImage
                ? "This banner currently has no image attached."
                : undefined
            }
            submitLabel={saving ? "Saving..." : "Save Changes"}
            saving={saving}
            checks={[
              { label: "Hero image attached", done: hasImage },
              { label: "Headline entered", done: Boolean(title.trim()) },
              { label: "CTA text & link set", done: Boolean(ctaText.trim() && ctaLink.trim()) },
            ]}
          />
        </div>
      </form>
    </div>
  );
}
