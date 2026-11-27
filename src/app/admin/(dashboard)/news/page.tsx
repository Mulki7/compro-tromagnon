"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Newspaper, Trash2, X } from "lucide-react";
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
import { deleteNews, getAdminNews } from "@/lib/api/admin/news";
import { News } from "@/types/models";
import { formatDate } from "@/lib/utils";

type Filter = "all" | "published" | "draft" | "with_cover";

export default function AdminNewsPage() {
  const { refreshShellData } = useAdminShell();
  const [items, setItems] = useState<News[]>([]);
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
      setItems(await getAdminNews());
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load news"));
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
      await Promise.all(deleteIds.map((id) => deleteNews(id)));
      setDeleteIds([]);
      setSelectedIds((prev) => prev.filter((id) => !deleteIds.includes(id)));
      await load();
      refreshShellData();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete article"));
      setDeleteIds([]);
    } finally {
      setDeleting(false);
    }
  };

  const publishedCount = useMemo(
    () => items.filter((n) => n.status === "published").length,
    [items]
  );
  const draftCount = items.length - publishedCount;
  const coverCount = useMemo(
    () => items.filter((n) => Boolean(n.cover_image_url)).length,
    [items]
  );

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((n) => {
      if (filter === "published" && n.status !== "published") return false;
      if (filter === "draft" && n.status !== "draft") return false;
      if (filter === "with_cover" && !n.cover_image_url) return false;
      if (!q) return true;
      return (
        n.title.toLowerCase().includes(q) ||
        (n.author || "").toLowerCase().includes(q)
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
        eyebrow={`${items.length} journal dispatches · ${publishedCount} published`}
        title="Journal & News"
        actions={<PrimaryCtaPill href="/admin/news/create" label="Write article" />}
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
            { key: "all", label: "All Dispatches", count: items.length },
            {
              key: "published",
              label: "Published",
              count: publishedCount,
              dotColor: "bg-admin-forest",
              tone: "lime",
            },
            {
              key: "draft",
              label: "Drafts",
              count: draftCount,
              dotColor: "bg-amber-500",
            },
            {
              key: "with_cover",
              label: "With Cover",
              count: coverCount,
              dotColor: "bg-emerald-600",
            },
          ]}
        />

        <AdminTable
          loading={loading}
          data={rows}
          rowKey={(n) => n.id}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleAll={setSelectedIds}
          bulkSummary="journal articles"
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
                placeholder="Search headline or author..."
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
            items.length === 0 ? "No articles written yet." : "No articles match your filters."
          }
          emptyAction={
            items.length === 0 && (
              <PrimaryCtaPill href="/admin/news/create" label="Write first article" />
            )
          }
          columns={[
            {
              key: "title",
              header: "Article",
              sortValue: (n) => n.title,
              render: (n) => (
                <Link
                  href={`/admin/news/${n.id}`}
                  className="group flex items-center gap-3"
                >
                  <Thumb
                    src={n.cover_image_url}
                    className="h-12 w-16 rounded-xl"
                    fallback={<Newspaper size={16} aria-hidden="true" />}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-[14.5px] font-bold text-admin-ink group-hover:text-admin-forest">
                      {n.title}
                    </p>
                    <p className="truncate text-[12.5px] text-admin-sub">
                      {n.author || "Tromagnon Records"}
                    </p>
                  </div>
                </Link>
              ),
            },
            {
              key: "date",
              header: "Date",
              sortValue: (n) => n.published_at || n.created_at || "",
              render: (n) => (
                <span className="font-medium tabular-nums text-admin-sub">
                  {formatDate(n.published_at || n.created_at) || "—"}
                </span>
              ),
            },
            {
              key: "status",
              header: "Status",
              sortValue: (n) => n.status,
              render: (n) => <StatusBadge status={n.status} />,
            },
            {
              key: "actions",
              header: "",
              className: "w-24 text-right",
              render: (n) => (
                <RowActions
                  editHref={`/admin/news/${n.id}`}
                  onDelete={() => setDeleteIds([n.id])}
                  label={n.title}
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
            ? `Delete ${deleteIds.length} articles?`
            : "Delete article?"
        }
        message="This permanently removes the dispatch from the journal."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteIds([])}
      />
    </div>
  );
}
