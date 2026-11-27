"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Image as ImageIcon, Trash2, X } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminTable from "@/components/admin/AdminTable";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import {
  KpiFilterRow,
  PrimaryCtaPill,
  RowActions,
  SearchField,
  Thumb,
} from "@/components/admin/ListControls";
import { useAdminShell } from "@/components/admin/AdminShellContext";
import { getErrorMessage } from "@/components/admin/formStyles";
import { deleteHeroBanner, getAdminHeroBanners } from "@/lib/api/admin/hero";
import { HeroBanner } from "@/types/models";

type Filter = "all" | "active" | "hidden";

export default function AdminHeroPage() {
  const { refreshShellData } = useAdminShell();
  const [items, setItems] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteIds, setDeleteIds] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getAdminHeroBanners();
      setItems([...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load banners"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async () => {
    if (deleteIds.length === 0) return;
    setDeleting(true);
    try {
      await Promise.all(deleteIds.map((id) => deleteHeroBanner(id)));
      setDeleteIds([]);
      setSelectedIds((prev) => prev.filter((id) => !deleteIds.includes(id)));
      await load();
      refreshShellData();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete banner"));
      setDeleteIds([]);
    } finally {
      setDeleting(false);
    }
  };

  const isActive = (h: HeroBanner) => h.is_active !== false;
  const activeCount = useMemo(() => items.filter(isActive).length, [items]);
  const hiddenCount = items.length - activeCount;

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((h) => {
      if (filter === "active" && !isActive(h)) return false;
      if (filter === "hidden" && isActive(h)) return false;
      if (!q) return true;
      return (
        h.title.toLowerCase().includes(q) ||
        (h.subtitle || "").toLowerCase().includes(q)
      );
    });
  }, [items, filter, query]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col pb-8">
      <AdminHeader
        eyebrow={`${items.length} homepage hero slides · ${activeCount} visible`}
        title="Hero Banners"
        actions={<PrimaryCtaPill href="/admin/hero/create" label="Add banner" />}
      />

      {error && (
        <div
          role="alert"
          className="mx-4 mb-4 rounded-2xl border border-admin-danger/25 bg-admin-danger-soft px-4 py-3 text-[13.5px] font-medium text-admin-danger sm:mx-6 lg:mx-7"
        >
          {error}
        </div>
      )}

      <div className="space-y-4 px-4 sm:px-6 lg:px-7">
        <KpiFilterRow
          value={filter}
          onChange={setFilter}
          options={[
            { key: "all", label: "All Slides", count: items.length },
            {
              key: "active",
              label: "Active on Home",
              count: activeCount,
              dotColor: "bg-admin-forest",
              tone: "lime",
            },
            {
              key: "hidden",
              label: "Hidden",
              count: hiddenCount,
              dotColor: "bg-admin-sub",
            },
          ]}
        />

        <AdminTable
          loading={loading}
          data={rows}
          rowKey={(h) => h.id}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleAll={setSelectedIds}
          bulkSummary="hero banners"
          bulkActions={
            <>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="inline-flex h-8 items-center gap-1 rounded-full bg-admin-forest-soft px-3 text-[12.5px] font-semibold text-white transition hover:bg-white/15"
              >
                <X size={13} aria-hidden="true" />
                Clear
              </button>
              <button
                type="button"
                onClick={() => setDeleteIds(selectedIds)}
                className="inline-flex h-8 items-center gap-1.5 rounded-full bg-admin-lime px-3.5 text-[12.5px] font-bold text-admin-forest transition hover:bg-admin-lime-hover"
              >
                <Trash2 size={13} aria-hidden="true" />
                Delete selected
              </button>
            </>
          }
          toolbar={
            <>
              <SearchField
                value={query}
                onChange={setQuery}
                placeholder="Search banner title or subtitle..."
              />
              {(filter !== "all" || query) && (
                <button
                  type="button"
                  onClick={() => {
                    setFilter("all");
                    setQuery("");
                  }}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full bg-admin-muted px-3.5 text-[12.5px] font-semibold text-admin-sub transition hover:bg-admin-sage/60 hover:text-admin-ink"
                >
                  <X size={13} aria-hidden="true" />
                  Reset filters
                </button>
              )}
            </>
          }
          emptyMessage={
            items.length === 0 ? "No hero banners created yet." : "No banners match your filters."
          }
          emptyAction={
            items.length === 0 && (
              <PrimaryCtaPill href="/admin/hero/create" label="Add first banner" />
            )
          }
          columns={[
            {
              key: "order",
              header: "Order",
              className: "w-20",
              sortValue: (h) => h.order ?? 0,
              render: (h) => (
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-[13px] font-bold tabular-nums text-admin-forest shadow-sm ring-1 ring-admin-border/70">
                  {h.order}
                </span>
              ),
            },
            {
              key: "title",
              header: "Banner",
              sortValue: (h) => h.title,
              render: (h) => (
                <Link
                  href={`/admin/hero/${h.id}`}
                  className="group flex items-center gap-3"
                >
                  <Thumb
                    src={h.image_url}
                    className="h-12 w-20 rounded-xl"
                    fallback={<ImageIcon size={16} aria-hidden="true" />}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-[14.5px] font-bold text-admin-ink group-hover:text-admin-forest">
                      {h.title}
                    </p>
                    <p className="truncate text-[12.5px] text-admin-sub">
                      {h.subtitle || "No subtitle"}
                    </p>
                  </div>
                </Link>
              ),
            },
            {
              key: "cta",
              header: "CTA",
              render: (h) =>
                h.cta_text ? (
                  <span className="rounded-full bg-white px-3 py-1 text-[12px] font-semibold text-admin-ink shadow-sm ring-1 ring-admin-border/70">
                    {h.cta_text}
                  </span>
                ) : (
                  <span className="text-admin-sub">—</span>
                ),
            },
            {
              key: "status",
              header: "Visibility",
              sortValue: (h) => (isActive(h) ? 1 : 0),
              render: (h) => <StatusBadge status={String(isActive(h))} />,
            },
            {
              key: "actions",
              header: "",
              className: "w-24 text-right",
              render: (h) => (
                <RowActions
                  editHref={`/admin/hero/${h.id}`}
                  onDelete={() => setDeleteIds([h.id])}
                  label={h.title}
                />
              ),
            },
          ]}
        />
      </div>

      <ConfirmDialog
        open={deleteIds.length > 0}
        title={
          deleteIds.length > 1
            ? `Delete ${deleteIds.length} banners?`
            : "Delete banner?"
        }
        message="This permanently removes the hero slide from the homepage."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteIds([])}
      />
    </div>
  );
}
