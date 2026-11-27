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
import { deleteRelease, getAdminReleases } from "@/lib/api/admin/releases";
import { Release } from "@/types/models";

type Filter = "all" | "published" | "draft" | "vinyl" | "missing_art";

export default function AdminReleasesPage() {
  const { refreshShellData } = useAdminShell();
  const [items, setItems] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [formatFilter, setFormatFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteIds, setDeleteIds] = useState<string[]>([]);
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
    if (deleteIds.length === 0) return;
    setDeleting(true);
    try {
      await Promise.all(deleteIds.map((id) => deleteRelease(id)));
      setDeleteIds([]);
      setSelectedIds((prev) => prev.filter((id) => !deleteIds.includes(id)));
      await load();
      refreshShellData();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete release"));
      setDeleteIds([]);
    } finally {
      setDeleting(false);
    }
  };

  const publishedCount = useMemo(
    () => items.filter((r) => r.status === "published").length,
    [items]
  );
  const draftCount = items.length - publishedCount;
  const vinylCount = useMemo(
    () =>
      items.filter((r) =>
        parseStringArray(r.format).some((f) =>
          ["lp", "vinyl", "ep"].includes(f.toLowerCase())
        )
      ).length,
    [items]
  );
  const missingArtCount = useMemo(
    () => items.filter((r) => !r.artwork_url).length,
    [items]
  );

  const availableFormats = useMemo(() => {
    const set = new Set<string>();
    items.forEach((r) => parseStringArray(r.format).forEach((f) => set.add(f)));
    return Array.from(set).sort();
  }, [items]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((r) => {
      if (filter === "published" && r.status !== "published") return false;
      if (filter === "draft" && r.status !== "draft") return false;
      if (
        filter === "vinyl" &&
        !parseStringArray(r.format).some((f) =>
          ["lp", "vinyl", "ep"].includes(f.toLowerCase())
        )
      ) {
        return false;
      }
      if (filter === "missing_art" && r.artwork_url) return false;
      if (
        formatFilter !== "all" &&
        !parseStringArray(r.format).includes(formatFilter)
      ) {
        return false;
      }
      if (!q) return true;
      return (
        r.title.toLowerCase().includes(q) ||
        (r.artist?.name || "").toLowerCase().includes(q) ||
        String(r.release_year).includes(q) ||
        r.slug.toLowerCase().includes(q)
      );
    });
  }, [items, filter, formatFilter, query]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleExport = () => {
    downloadCsv(
      "tromagnon-releases.csv",
      ["Title", "Artist", "Year", "Formats", "Status", "Slug"],
      rows.map((r) => [
        r.title,
        r.artist?.name || "Tromagnon",
        r.release_year,
        parseStringArray(r.format).join(" | "),
        r.status,
        r.slug,
      ])
    );
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col pb-3 lg:overflow-hidden">
      <AdminHeader
        title="Releases"
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
            <PrimaryCtaPill href="/admin/releases/create" label="New release" />
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
              key: "vinyl",
              label: "LP / EP",
              count: vinylCount,
              dotColor: "bg-admin-forest-soft",
            },
            {
              key: "missing_art",
              label: "No artwork",
              count: missingArtCount,
              dotColor: "bg-admin-danger",
            },
          ]}
        />

        <AdminTable
          loading={loading}
          data={rows}
          rowKey={(r) => r.id}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleAll={setSelectedIds}
          rowTone={(r) => (!r.artwork_url ? "warning" : "default")}
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
              <div className="flex flex-wrap items-center gap-2">
                <SearchField
                  value={query}
                  onChange={setQuery}
                  placeholder="Search title, artist, year…"
                />
                {availableFormats.length > 0 && (
                  <select
                    aria-label="Filter by format"
                    value={formatFilter}
                    onChange={(e) => setFormatFilter(e.target.value)}
                    className="h-10 rounded-lg border border-admin-border-strong bg-admin-canvas px-3 font-admin text-[13.5px] font-medium text-admin-ink focus:border-admin-forest focus:bg-admin-surface focus:outline-none"
                  >
                    <option value="all">All formats</option>
                    {availableFormats.map((fmt) => (
                      <option key={fmt} value={fmt}>
                        {fmt}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {(filter !== "all" || formatFilter !== "all" || query) && (
                <button
                  type="button"
                  onClick={() => {
                    setFilter("all");
                    setFormatFilter("all");
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
            items.length === 0 ? "No releases yet." : "No matching releases."
          }
          emptyAction={
            items.length === 0 && (
              <PrimaryCtaPill href="/admin/releases/create" label="New release" />
            )
          }
          columns={[
            {
              key: "title",
              header: "Release",
              sortValue: (r) => r.title,
              render: (r) => (
                <Link
                  href={`/admin/releases/${r.id}`}
                  className="group flex items-center gap-3"
                >
                  <Thumb src={r.artwork_url} className="aspect-square h-11 w-11 rounded-md" />
                  <div className="min-w-0">
                    <p className="truncate font-display text-[16px] font-semibold leading-tight text-admin-ink group-hover:text-admin-forest-soft">
                      {r.title}
                    </p>
                    <p className="mt-0.5 truncate font-admin text-[12.5px] text-admin-sub">
                      {r.artist?.name || "Tromagnon"}
                    </p>
                  </div>
                </Link>
              ),
            },
            {
              key: "format",
              header: "Formats",
              render: (r) => {
                const fmts = parseStringArray(r.format);
                return fmts.length ? (
                  <div className="flex flex-wrap gap-1">
                    {fmts.slice(0, 3).map((f) => (
                      <span
                        key={f}
                        className="rounded-md border border-admin-border bg-admin-surface px-2 py-0.5 font-admin text-[12px] font-medium text-admin-ink"
                      >
                        {f}
                      </span>
                    ))}
                    {fmts.length > 3 && (
                      <span className="rounded-md bg-admin-muted px-1.5 py-0.5 font-admin text-[12px] font-semibold text-admin-sub">
                        +{fmts.length - 3}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-admin-sub">—</span>
                );
              },
            },
            {
              key: "year",
              header: "Year",
              sortValue: (r) => r.release_year || 0,
              render: (r) => (
                <span className="font-medium tabular-nums text-admin-ink">
                  {r.release_year}
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
              className: "w-24 text-right",
              render: (r) => (
                <RowActions
                  editHref={`/admin/releases/${r.id}`}
                  onDelete={() => setDeleteIds([r.id])}
                  label={r.title}
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
            ? `Delete ${deleteIds.length} releases?`
            : "Delete release?"
        }
        message="This removes the selected release from the catalog."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteIds([])}
      />
    </div>
  );
}
