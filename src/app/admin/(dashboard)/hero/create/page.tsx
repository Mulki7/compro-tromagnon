"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import ImageUpload from "@/components/admin/ImageUpload";
import StatusBadge from "@/components/admin/StatusBadge";
import FormSummaryCard from "@/components/admin/FormSummaryCard";
import { SegmentedToggle } from "@/components/admin/ListControls";
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
import { createHeroBanner } from "@/lib/api/admin/hero";

export default function CreateHeroPage() {
  const router = useRouter();
  const { refreshShellData } = useAdminShell();
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
      if (res.success) {
        refreshShellData();
        router.push("/admin/hero");
      } else {
        setError(res.message || "Failed to create banner");
      }
    } catch (err) {
      setError(getErrorMessage(err, "Failed to create banner"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pb-12">
      <AdminHeader
        backHref="/admin/hero"
        backLabel="Banners"
        title={title.trim() || "Add banner"}
        badge={<StatusBadge status={String(isActive)} />}
        actions={
          <Link href="/admin/hero" className={btnSecondary}>
            Cancel
          </Link>
        }
      />

      <form
        onSubmit={handleSubmit}
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
              <h2 className={formSectionTitleClass}>Slide</h2>
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
              label="Image"
              value={bannerImage}
              onChange={setBannerImage}
            />

            <div>
              <label htmlFor="hero-title" className={labelClass}>
                Title
              </label>
              <input
                id="hero-title"
                required
                placeholder="e.g. Satelit Compilation LP"
                className={inputClass}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="hero-subtitle" className={labelClass}>
                Subtitle
              </label>
              <input
                id="hero-subtitle"
                placeholder="Tromagnon Records × Loide Records"
                className={inputClass}
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="hero-cta-text" className={labelClass}>
                  Button text
                </label>
                <input
                  id="hero-cta-text"
                  className={inputClass}
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="Explore"
                />
              </div>
              <div>
                <label htmlFor="hero-cta-link" className={labelClass}>
                  Button link
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
                  Order
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
            title="Summary"
            rows={[
              { label: "Title", value: title || "—" },
              { label: "Button", value: ctaText || "—" },
              { label: "Link", value: ctaLink || "—" },
              { label: "Order", value: `#${order}` },
            ]}
            highlightLabel="Visibility"
            highlightValue={isActive ? "Visible" : "Hidden"}
            warningText={!bannerImage ? "No banner image uploaded yet." : undefined}
            submitLabel={saving ? "Saving…" : "Create banner"}
            saving={saving}
            checks={[
              { label: "Image", done: Boolean(bannerImage) },
              { label: "Title", done: Boolean(title.trim()) },
              { label: "Button & link", done: Boolean(ctaText.trim() && ctaLink.trim()) },
            ]}
          />
        </div>
      </form>
    </div>
  );
}
