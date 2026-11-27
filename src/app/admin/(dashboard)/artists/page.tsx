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
    <div className="flex min-h-0 flex-1 flex-col pb-8">
      <AdminHeader
        eyebrow={`${items.length} artists signed · ${activeCount} active on roster`}
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
              Export CSV
            </button>
            <PrimaryCtaPill href="/admin/artists/create" label="Add artist" />
          </>
        }
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
            { key: "all", label: "All Artists", count: items.length },
            {
              key: "active",
              label: "Active Roster",
              count: activeCount,
              dotColor: "bg-admin-forest",
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
              label: "Missing Photo",
              count: missingPhotoCount,
              dotColor: "bg-amber-500",
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
          bulkSummary="roster entries"
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
                placeholder="Search artist name or genre..."
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
            items.length === 0 ? "No artists on the roster yet." : "No artists match your filters."
          }
          emptyAction={
            items.length === 0 && (
              <PrimaryCtaPill href="/admin/artists/create" label="Add first artist" />
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
                    className="h-11 w-11 rounded-full"
                    fallback={a.name[0]?.toUpperCase()}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-[14.5px] font-bold text-admin-ink group-hover:text-admin-forest">
                      {a.name}
                    </p>
                    <p className="truncate text-[12.5px] text-admin-sub">/{a.slug}</p>
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
                        className="rounded-full bg-white px-2.5 py-0.5 text-[11.5px] font-semibold text-admin-ink shadow-sm ring-1 ring-admin-border/70"
                      >
                        {g}
                      </span>
                    ))}
                    {list.length > 3 && (
                      <span className="rounded-full bg-admin-sage/70 px-2 py-0.5 text-[11.5px] font-semibold text-admin-forest">
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
              header: "Channels",
              render: (a) => {
                const count = Object.values(a.social_links || {}).filter(Boolean).length;
                return (
                  <span className="text-[13px] font-semibold tabular-nums text-admin-sub">
                    {count > 0 ? `${count} linked` : "None"}
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
        message={
          deleteIds.length > 1
            ? "This removes the selected artists from the label roster."
            : "This removes the artist from the label roster."
        }
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteIds([])}
      />
    </div>
  );
}
