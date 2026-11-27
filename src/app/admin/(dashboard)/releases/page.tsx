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
import { btnPrimarySm, getErrorMessage, parseStringArray } from "@/components/admin/formStyles";
import { deleteRelease, getAdminReleases } from "@/lib/api/admin/releases";
import { Release } from "@/types/models";

type Filter = "all" | "published" | "draft";

export default function AdminReleasesPage() {
  const { onMenuClick } = useAdminShell();
  const [items, setItems] = useState<Release[]>([]);
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
      setItems(await getAdminReleases());
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load releases"));
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
      await deleteRelease(deleteId);
      setDeleteId(null);
      await load();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete release"));
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  };

  const published = items.filter((r) => r.status === "published").length;

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((r) => {
      if (filter !== "all" && r.status !== filter) return false;
      if (!q) return true;
      return (
        r.title.toLowerCase().includes(q) ||
        (r.artist?.name || "").toLowerCase().includes(q) ||
        String(r.release_year).includes(q)
      );
    });
  }, [items, filter, query]);

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:overflow-hidden">
      <AdminHeader
        title="Releases"
        subtitle="Catalog and physical pressings"
        onMenuClick={onMenuClick}
        actions={
          <Link href="/admin/releases/create" className={btnPrimarySm}>
            <Plus size={15} aria-hidden="true" />
            Add release
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
          <SearchField value={query} onChange={setQuery} placeholder="Search title, artist, year" />
        </div>
      </div>

      <AdminTable
        loading={loading}
        data={rows}
        rowKey={(r) => r.id}
        emptyMessage={items.length === 0 ? "No releases yet." : "No releases match."}
        emptyAction={
          items.length === 0 && (
            <Link href="/admin/releases/create" className={btnPrimarySm}>
              <Plus size={15} aria-hidden="true" />
              Add the first release
            </Link>
          )
        }
        columns={[
          {
            key: "title",
            header: "Release",
            sortValue: (r) => r.title,
            render: (r) => (
              <div className="flex items-center gap-3">
                <Thumb src={r.artwork_url} className="h-11 w-11 rounded-md" />
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-semibold">{r.title}</p>
                  <p className="truncate text-[13px] text-satelit-muted">
                    {r.artist?.name || "Tromagnon"}
                  </p>
                </div>
              </div>
            ),
          },
          {
            key: "year",
            header: "Year",
            sortValue: (r) => r.release_year || 0,
            render: (r) => <span className="tabular-nums">{r.release_year}</span>,
          },
          {
            key: "format",
            header: "Format",
            render: (r) => (
              <span className="text-satelit-muted">
                {parseStringArray(r.format).join(" · ") || "-"}
              </span>
            ),
          },
          {
            key: "status",
            header: "Status",
            sortValue: (r) => r.status,
            render: (r) => <StatusBadge status={r.status} />,
          },
          {
            key: "actions",
            header: "",
            className: "w-24 pr-0 text-right",
            render: (r) => (
              <RowActions
                editHref={`/admin/releases/${r.id}`}
                onDelete={() => setDeleteId(r.id)}
                label={r.title}
              />
            ),
          },
        ]}
      />

      <ConfirmDialog
        open={!!deleteId}
        title="Delete release?"
        message="This removes the release from the catalog."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
