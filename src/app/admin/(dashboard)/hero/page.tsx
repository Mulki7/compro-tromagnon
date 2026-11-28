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
    <div className="flex min-h-0 flex-1 flex-col pb-3 lg:overflow-hidden">
      <AdminHeader
        title="Banners"
        actions={<PrimaryCtaPill href="/admin/hero/create" label="Add banner" />}
      />

      {error && (
        <div
          role="alert"
          className="mx-4 mb-3 shrink-0 rounded-lg border border-admin-danger bg-admin-danger-soft px-4 py-2.5 font-admin text-[13.5px] font-medium text-admin-danger sm:mx-5 lg:mx-6"
        >
          {error}
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col gap-3.5 px-4 sm:px-5 lg:px-6">
        <KpiFilterRow
          value={filter}
          onChange={setFilter}
          options={[
            { key: "all", label: "All", count: items.length },
            {
              key: "active",
              label: "Visible",
              count: activeCount,
              dotColor: "bg-admin-success",
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
          bulkActions={
            <>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="inline-flex h-8 items-center gap-1 rounded-md bg-admin-forest-soft px-3 font-admin text-[12.5px] font-semibold text-[#F1F2EE] transition-colors duration-[120ms] hover:bg-admin-forest-deep"
              >
                <X size={13} aria-hidden="true" />
                Clear
              </button>
              <button
                type="button"
                onClick={() => setDeleteIds(selectedIds)}
                className="inline-flex h-8 items-center gap-1.5 rounded-md bg-admin-lime px-3 font-admin text-[12.5px] font-semibold text-admin-on-lime transition-colors duration-[120ms] hover:bg-admin-lime-hover"
              >
                <Trash2 size={13} aria-hidden="true" />
                Delete
              </button>
            </>
          }
          toolbar={
            <>
              <SearchField
                value={query}
                onChange={setQuery}
                placeholder="Search title or subtitle…"
              />
              {(filter !== "all" || query) && (
                <button
                  type="button"
                  onClick={() => {
                    setFilter("all");
                    setQuery("");
                  }}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-admin-border-strong px-3 font-admin text-[13px] font-semibold text-admin-ink transition-colors duration-[120ms] hover:bg-admin-elevated"
                >
                  <X size={13} aria-hidden="true" />
                  Reset
                </button>
              )}
            </>
          }
          emptyMessage={
            items.length === 0 ? "No banners yet." : "No matching banners."
          }
          emptyAction={
            items.length === 0 && (
              <PrimaryCtaPill href="/admin/hero/create" label="Add banner" />
            )
          }
          columns={[
            {
              key: "order",
              header: "Order",
              className: "w-20",
              sortValue: (h) => h.order ?? 0,
              render: (h) => (
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-admin-border bg-admin-surface font-admin text-[12.5px] font-semibold tabular-nums text-admin-forest">
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
                    className="h-11 w-16 rounded-md"
                    fallback={<ImageIcon size={15} aria-hidden="true" />}
                  />
                  <div className="min-w-0">
                    <p className="truncate font-admin text-[15px] font-semibold leading-[1.25] tracking-[-0.01em] text-admin-ink group-hover:text-admin-forest-soft">
                      {h.title}
                    </p>
                    <p className="mt-0.5 truncate font-admin text-[12.5px] text-admin-sub">
                      {h.subtitle || "—"}
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
                  <span className="rounded-md border border-admin-border bg-admin-surface px-2.5 py-0.5 font-admin text-[12px] font-semibold text-admin-ink">
                    {h.cta_text}
                  </span>
                ) : (
                  <span className="text-admin-sub">—</span>
                ),
            },
            {
              key: "status",
              header: "Status",
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
        message="This removes the slide from the homepage."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteIds([])}
      />
    </div>
  );
}
