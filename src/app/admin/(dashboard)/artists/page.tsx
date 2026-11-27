"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Download, Trash2, X } from "lucide-react";
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
import {
  btnSecondary,
  downloadCsv,
  getErrorMessage,
  parseStringArray,
} from "@/components/admin/formStyles";
import { deleteArtist, getAdminArtists } from "@/lib/api/admin/artists";
import { Artist } from "@/types/models";

type Filter = "all" | "active" | "inactive" | "missing_photo";

export default function AdminArtistsPage() {
  const { refreshShellData } = useAdminShell();
  const [items, setItems] = useState<Artist[]>([]);
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
    if (deleteIds.length === 0) return;
    setDeleting(true);
    try {
      await Promise.all(deleteIds.map((id) => deleteArtist(id)));
      setDeleteIds([]);
      setSelectedIds((prev) => prev.filter((id) => !deleteIds.includes(id)));
      await load();
      refreshShellData();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete artist"));
      setDeleteIds([]);
    } finally {
      setDeleting(false);
    }
  };

  const activeCount = useMemo(
    () => items.filter((a) => a.status === "active").length,
    [items]
  );
  const inactiveCount = items.length - activeCount;
  const missingPhotoCount = useMemo(
    () => items.filter((a) => !a.photo_url).length,
    [items]
  );

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((a) => {
      if (filter === "active" && a.status !== "active") return false;
      if (filter === "inactive" && a.status !== "inactive") return false;
      if (filter === "missing_photo" && a.photo_url) return false;
      if (!q) return true;
      return (
        a.name.toLowerCase().includes(q) ||
        a.slug.toLowerCase().includes(q) ||
        parseStringArray(a.genre).some((g) => g.toLowerCase().includes(q))
      );
    });
  }, [items, filter, query]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleExport = () => {
    downloadCsv(
      "tromagnon-artists.csv",
      ["Name", "Slug", "Genres", "Status"],
      rows.map((a) => [
        a.name,
        a.slug,
        parseStringArray(a.genre).join(" | "),
        a.status,
      ])
    );
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col pb-3 lg:overflow-hidden">
      <AdminHeader
        title="Artists"
        actions={
          <>
            <button
              type="button"
              onClick={handleExport}
              disabled={rows.length === 0}
              className={btnSecondary}
            >
              <Download size={14} aria-hidden="true" />
              Export
            </button>
            <PrimaryCtaPill href="/admin/artists/create" label="Add artist" />
          </>
        }
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
              label: "Active",
              count: activeCount,
              dotColor: "bg-admin-success",
              tone: "lime",
            },
            {
              key: "inactive",
              label: "Archived",
              count: inactiveCount,
              dotColor: "bg-admin-sub",
            },
            {
              key: "missing_photo",
              label: "No photo",
              count: missingPhotoCount,
              dotColor: "bg-admin-amber",
            },
          ]}
        />

        <AdminTable
          loading={loading}
          data={rows}
          rowKey={(a) => a.id}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleAll={setSelectedIds}
          rowTone={(a) => (!a.photo_url ? "warning" : "default")}
          bulkActions={
            <>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="inline-flex h-8 items-center gap-1 rounded-md bg-admin-forest-soft px-3 font-display text-[13px] font-semibold text-[#F1F2EE] transition-colors duration-[120ms] hover:bg-admin-forest-deep"
              >
                <X size={13} aria-hidden="true" />
                Clear
              </button>
              <button
                type="button"
                onClick={() => setDeleteIds(selectedIds)}
                className="inline-flex h-8 items-center gap-1.5 rounded-md bg-admin-lime px-3 font-display text-[13px] font-semibold text-admin-on-lime transition-colors duration-[120ms] hover:bg-admin-lime-hover"
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
                placeholder="Search name or genre…"
              />
              {(filter !== "all" || query) && (
                <button
                  type="button"
                  onClick={() => {
                    setFilter("all");
                    setQuery("");
                  }}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-admin-border-strong px-3 font-display text-[13px] font-semibold text-admin-ink transition-colors duration-[120ms] hover:bg-admin-elevated"
                >
                  <X size={13} aria-hidden="true" />
                  Reset
                </button>
              )}
            </>
          }
          emptyMessage={
            items.length === 0 ? "No artists yet." : "No matching artists."
          }
          emptyAction={
            items.length === 0 && (
              <PrimaryCtaPill href="/admin/artists/create" label="Add artist" />
            )
          }
          columns={[
            {
              key: "name",
              header: "Artist",
              sortValue: (a) => a.name,
              render: (a) => (
                <Link
                  href={`/admin/artists/${a.id}`}
                  className="group flex items-center gap-3"
                >
                  <Thumb
                    src={a.photo_url}
                    className="aspect-square h-10 w-10 rounded-md"
                    fallback={a.name[0]?.toUpperCase()}
                  />
                  <div className="min-w-0">
                    <p className="truncate font-display text-[16px] font-semibold leading-tight text-admin-ink group-hover:text-admin-forest-soft">
                      {a.name}
                    </p>
                    <p className="mt-0.5 truncate font-admin text-[12.5px] text-admin-sub">
                      /{a.slug}
                    </p>
                  </div>
                </Link>
              ),
            },
            {
              key: "genre",
              header: "Genres",
              render: (a) => {
                const list = parseStringArray(a.genre);
                return list.length ? (
                  <div className="flex flex-wrap gap-1">
                    {list.slice(0, 3).map((g) => (
                      <span
                        key={g}
                        className="rounded-md border border-admin-border bg-admin-surface px-2 py-0.5 font-admin text-[12px] font-medium text-admin-ink"
                      >
                        {g}
                      </span>
                    ))}
                    {list.length > 3 && (
                      <span className="rounded-md bg-admin-muted px-1.5 py-0.5 font-admin text-[12px] font-semibold text-admin-sub">
                        +{list.length - 3}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-admin-sub">—</span>
                );
              },
            },
            {
              key: "socials",
              header: "Links",
              render: (a) => {
                const count = Object.values(a.social_links || {}).filter(Boolean).length;
                return (
                  <span className="font-admin text-[13px] tabular-nums text-admin-sub">
                    {count > 0 ? count : "—"}
                  </span>
                );
              },
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
              className: "w-24 text-right",
              render: (a) => (
                <RowActions
                  editHref={`/admin/artists/${a.id}`}
                  onDelete={() => setDeleteIds([a.id])}
                  label={a.name}
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
            ? `Delete ${deleteIds.length} artists?`
            : "Delete artist?"
        }
        message="This removes the artist from the roster."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteIds([])}
      />
    </div>
  );
}
