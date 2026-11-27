"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminTable from "@/components/admin/AdminTable";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { FilterTabs, RowActions, Thumb } from "@/components/admin/ListControls";
import { useAdminShell } from "@/components/admin/AdminShellContext";
import { btnPrimarySm, getErrorMessage } from "@/components/admin/formStyles";
import { deleteHeroBanner, getAdminHeroBanners } from "@/lib/api/admin/hero";
import { HeroBanner } from "@/types/models";

type Filter = "all" | "active" | "hidden";

export default function AdminHeroPage() {
  const { onMenuClick } = useAdminShell();
  const [items, setItems] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
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
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteHeroBanner(deleteId);
      setDeleteId(null);
      await load();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete banner"));
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  };

  const isActive = (h: HeroBanner) => h.is_active !== false;
  const active = items.filter(isActive).length;

  const rows = useMemo(
    () =>
      items.filter((h) =>
        filter === "all" ? true : filter === "active" ? isActive(h) : !isActive(h)
      ),
    [items, filter]
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:overflow-hidden">
      <AdminHeader
        title="Banners"
        subtitle="Homepage hero slides"
        onMenuClick={onMenuClick}
        actions={
          <Link href="/admin/hero/create" className={btnPrimarySm}>
            <Plus size={15} aria-hidden="true" />
            Add banner
          </Link>
        }
      />

      {error && (
        <div role="alert" className="mx-5 mb-3 rounded-lg border border-satelit-danger/30 bg-satelit-danger/10 px-4 py-2.5 text-[14px] text-satelit-danger sm:mx-7">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2 border-b border-satelit-border px-5 sm:px-7">
        <FilterTabs
          value={filter}
          onChange={setFilter}
          options={[
            { key: "all", label: "All", count: items.length },
            { key: "active", label: "Active", count: active },
            { key: "hidden", label: "Hidden", count: items.length - active },
          ]}
        />
      </div>

      <AdminTable
        loading={loading}
        data={rows}
        rowKey={(h) => h.id}
        emptyMessage={items.length === 0 ? "No banners yet." : "No banners match."}
        emptyAction={
          items.length === 0 && (
            <Link href="/admin/hero/create" className={btnPrimarySm}>
              <Plus size={15} aria-hidden="true" />
              Add the first banner
            </Link>
          )
        }
        columns={[
          {
            key: "order",
            header: "Order",
            className: "w-20",
            sortValue: (h) => h.order ?? 0,
            render: (h) => <span className="tabular-nums text-satelit-muted">{h.order}</span>,
          },
          {
            key: "title",
            header: "Banner",
            sortValue: (h) => h.title,
            render: (h) => (
              <div className="flex items-center gap-3">
                <Thumb src={h.image_url} className="h-11 w-[72px] rounded-md" />
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-semibold">{h.title}</p>
                  <p className="truncate text-[13px] text-satelit-muted">
                    {h.subtitle || "-"}
                  </p>
                </div>
              </div>
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
            className: "w-24 pr-0 text-right",
            render: (h) => (
              <RowActions
                editHref={`/admin/hero/${h.id}`}
                onDelete={() => setDeleteId(h.id)}
                label={h.title}
              />
            ),
          },
        ]}
      />

      <ConfirmDialog
        open={!!deleteId}
        title="Delete banner?"
        message="This removes the banner from the homepage."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
