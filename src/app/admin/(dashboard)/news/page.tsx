"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminTable from "@/components/admin/AdminTable";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { FilterTabs, RowActions, SearchField, Thumb } from "@/components/admin/ListControls";
import { useAdminShell } from "@/components/admin/AdminShellContext";
import { btnPrimarySm, getErrorMessage } from "@/components/admin/formStyles";
import { deleteNews, getAdminNews } from "@/lib/api/admin/news";
import { News } from "@/types/models";
import { formatDate } from "@/lib/utils";

type Filter = "all" | "published" | "draft";

export default function AdminNewsPage() {
  const { onMenuClick } = useAdminShell();
  const [items, setItems] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
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
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteNews(deleteId);
      setDeleteId(null);
      await load();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete article"));
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  };

  const published = items.filter((n) => n.status === "published").length;

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((n) => {
      if (filter !== "all" && n.status !== filter) return false;
      if (!q) return true;
      return (
        n.title.toLowerCase().includes(q) ||
        (n.author || "").toLowerCase().includes(q)
      );
    });
  }, [items, filter, query]);

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:overflow-hidden">
      <AdminHeader
        title="News"
        subtitle="Journal and dispatches"
        onMenuClick={onMenuClick}
        actions={
          <Link href="/admin/news/create" className={btnPrimarySm}>
            <Plus size={15} aria-hidden="true" />
            Write article
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
            { key: "published", label: "Published", count: published },
            { key: "draft", label: "Drafts", count: items.length - published },
          ]}
        />
        <div className="pb-2.5">
          <SearchField value={query} onChange={setQuery} placeholder="Search title or author" />
        </div>
      </div>

      <AdminTable
        loading={loading}
        data={rows}
        rowKey={(n) => n.id}
        emptyMessage={items.length === 0 ? "No articles yet." : "No articles match."}
        emptyAction={
          items.length === 0 && (
            <Link href="/admin/news/create" className={btnPrimarySm}>
              <Plus size={15} aria-hidden="true" />
              Write the first article
            </Link>
          )
        }
        columns={[
          {
            key: "title",
            header: "Article",
            sortValue: (n) => n.title,
            render: (n) => (
              <div className="flex items-center gap-3">
                <Thumb src={n.cover_image_url} className="h-11 w-14 rounded-md" />
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-semibold">{n.title}</p>
                  <p className="truncate text-[13px] text-satelit-muted">
                    {n.author || "Tromagnon"}
                  </p>
                </div>
              </div>
            ),
          },
          {
            key: "date",
            header: "Published",
            sortValue: (n) => n.published_at || n.created_at || "",
            render: (n) => (
              <span className="tabular-nums text-satelit-muted">
                {formatDate(n.published_at || n.created_at) || "-"}
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
            className: "w-24 pr-0 text-right",
            render: (n) => (
              <RowActions
                editHref={`/admin/news/${n.id}`}
                onDelete={() => setDeleteId(n.id)}
                label={n.title}
              />
            ),
          },
        ]}
      />

      <ConfirmDialog
        open={!!deleteId}
        title="Delete article?"
        message="This removes the article from the journal."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
