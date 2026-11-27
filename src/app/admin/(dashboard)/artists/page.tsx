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
import { deleteArtist, getAdminArtists } from "@/lib/api/admin/artists";
import { Artist } from "@/types/models";

type Filter = "all" | "active" | "inactive";

export default function AdminArtistsPage() {
  const { onMenuClick } = useAdminShell();
  const [items, setItems] = useState<Artist[]>([]);
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
      setItems(await getAdminArtists());
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load artists"));
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
      await deleteArtist(deleteId);
      setDeleteId(null);
      await load();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete artist"));
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  };

  const active = items.filter((a) => a.status === "active").length;

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((a) => {
      if (filter !== "all" && a.status !== filter) return false;
      if (!q) return true;
      return (
        a.name.toLowerCase().includes(q) ||
        parseStringArray(a.genre).some((g) => g.toLowerCase().includes(q))
      );
    });
  }, [items, filter, query]);

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:overflow-hidden">
      <AdminHeader
        title="Artists"
        subtitle="The roster"
        onMenuClick={onMenuClick}
        actions={
          <Link href="/admin/artists/create" className={btnPrimarySm}>
            <Plus size={15} aria-hidden="true" />
            Add artist
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
            { key: "inactive", label: "Inactive", count: items.length - active },
          ]}
        />
        <div className="pb-2.5">
          <SearchField value={query} onChange={setQuery} placeholder="Search name or genre" />
        </div>
      </div>

      <AdminTable
        loading={loading}
        data={rows}
        rowKey={(a) => a.id}
        emptyMessage={items.length === 0 ? "No artists yet." : "No artists match."}
        emptyAction={
          items.length === 0 && (
            <Link href="/admin/artists/create" className={btnPrimarySm}>
              <Plus size={15} aria-hidden="true" />
              Add the first artist
            </Link>
          )
        }
        columns={[
          {
            key: "name",
            header: "Artist",
            sortValue: (a) => a.name,
            render: (a) => (
              <div className="flex items-center gap-3">
                <Thumb
                  src={a.photo_url}
                  className="h-11 w-11 rounded-full"
                  fallback={a.name[0]?.toUpperCase()}
                />
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-semibold">{a.name}</p>
                  <p className="truncate text-[13px] text-satelit-muted">/{a.slug}</p>
                </div>
              </div>
            ),
          },
          {
            key: "genre",
            header: "Genre",
            render: (a) => (
              <span className="text-satelit-muted">
                {parseStringArray(a.genre).join(" · ") || "-"}
              </span>
            ),
          },
          {
            key: "status",
            header: "Status",
            sortValue: (a) => a.status,
            render: (a) => <StatusBadge status={a.status} />,
          },
          {
            key: "actions",
            header: "",
            className: "w-24 pr-0 text-right",
            render: (a) => (
              <RowActions
                editHref={`/admin/artists/${a.id}`}
                onDelete={() => setDeleteId(a.id)}
                label={a.name}
              />
            ),
          },
        ]}
      />

      <ConfirmDialog
        open={!!deleteId}
        title="Delete artist?"
        message="This removes the artist from the roster."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
