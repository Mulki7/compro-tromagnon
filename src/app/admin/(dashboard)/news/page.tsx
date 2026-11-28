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
      setError(getErrorMessage(err, "Failed to load articles"));
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
    <div className="flex min-h-0 flex-1 flex-col pb-3 lg:overflow-hidden">
      <AdminHeader
        title="Journal"
        actions={<PrimaryCtaPill href="/admin/news/create" label="Write article" />}
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
              key: "published",
              label: "Published",
              count: publishedCount,
              dotColor: "bg-admin-success",
              tone: "lime",
            },
            {
              key: "draft",
              label: "Drafts",
              count: draftCount,
              dotColor: "bg-admin-amber",
            },
            {
              key: "with_cover",
              label: "With cover",
              count: coverCount,
              dotColor: "bg-admin-forest-soft",
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
                placeholder="Search title or author…"
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
            items.length === 0 ? "No articles yet." : "No matching articles."
          }
          emptyAction={
            items.length === 0 && (
              <PrimaryCtaPill href="/admin/news/create" label="Write article" />
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
                    className="h-11 w-14 rounded-md"
                    fallback={<Newspaper size={15} aria-hidden="true" />}
                  />
                  <div className="min-w-0">
                    <p className="truncate font-admin text-[15px] font-semibold leading-[1.25] tracking-[-0.01em] text-admin-ink group-hover:text-admin-forest-soft">
                      {n.title}
                    </p>
                    <p className="mt-0.5 truncate font-admin text-[12.5px] text-admin-sub">
                      {n.author || "Tromagnon"}
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
                <span className="font-admin text-[13.5px] tabular-nums text-admin-sub">
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
        message="This removes the article from the journal."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteIds([])}
      />
    </div>
  );
}
