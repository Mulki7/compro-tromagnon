"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, ExternalLink, MapPin, Trash2, X } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminTable from "@/components/admin/AdminTable";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import {
  KpiFilterRow,
  PrimaryCtaPill,
  RowActions,
  SearchField,
} from "@/components/admin/ListControls";
import { useAdminShell } from "@/components/admin/AdminShellContext";
import { getErrorMessage } from "@/components/admin/formStyles";
import { deleteLiveEvent, getAdminLiveEvents } from "@/lib/api/admin/live";
import { LiveEvent } from "@/types/models";
import { formatDate } from "@/lib/utils";

type Filter = "all" | "upcoming" | "past" | "cancelled";

export default function AdminLivePage() {
  const { refreshShellData } = useAdminShell();
  const [items, setItems] = useState<LiveEvent[]>([]);
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
      setItems(await getAdminLiveEvents());
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load live events"));
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
      await Promise.all(deleteIds.map((id) => deleteLiveEvent(id)));
      setDeleteIds([]);
      setSelectedIds((prev) => prev.filter((id) => !deleteIds.includes(id)));
      await load();
      refreshShellData();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete event"));
      setDeleteIds([]);
    } finally {
      setDeleting(false);
    }
  };

  const upcomingCount = useMemo(
    () => items.filter((e) => e.status === "upcoming").length,
    [items]
  );
  const pastCount = useMemo(
    () => items.filter((e) => e.status === "past").length,
    [items]
  );
  const cancelledCount = useMemo(
    () => items.filter((e) => e.status === "cancelled").length,
    [items]
  );

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((e) => {
      if (filter !== "all" && e.status !== filter) return false;
      if (!q) return true;
      return (
        (e.artist?.name || "").toLowerCase().includes(q) ||
        (e.venue || "").toLowerCase().includes(q) ||
        (e.city || "").toLowerCase().includes(q) ||
        (e.country || "").toLowerCase().includes(q)
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
        eyebrow={`${items.length} scheduled dates · ${upcomingCount} upcoming shows`}
        title="Live Shows"
        actions={<PrimaryCtaPill href="/admin/live/create" label="Schedule show" />}
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
            { key: "all", label: "All Shows", count: items.length },
            {
              key: "upcoming",
              label: "Upcoming",
              count: upcomingCount,
              dotColor: "bg-admin-forest",
              tone: "lime",
            },
            {
              key: "past",
              label: "Completed",
              count: pastCount,
              dotColor: "bg-admin-sub",
            },
            {
              key: "cancelled",
              label: "Cancelled",
              count: cancelledCount,
              dotColor: "bg-red-500",
            },
          ]}
        />

        <AdminTable
          loading={loading}
          data={rows}
          rowKey={(e) => e.id}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleAll={setSelectedIds}
          rowTone={(e) => (e.status === "cancelled" ? "danger" : "default")}
          bulkSummary="live dates"
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
                placeholder="Search artist, venue, city..."
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
            items.length === 0 ? "No shows scheduled yet." : "No shows match your filters."
          }
          emptyAction={
            items.length === 0 && (
              <PrimaryCtaPill href="/admin/live/create" label="Schedule first show" />
            )
          }
          columns={[
            {
              key: "date",
              header: "Date",
              sortValue: (e) => e.event_date || "",
              render: (e) => (
                <Link
                  href={`/admin/live/${e.id}`}
                  className="inline-flex items-center gap-2.5 font-bold tabular-nums text-admin-ink hover:text-admin-forest"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-admin-forest shadow-sm ring-1 ring-admin-border/70">
                    <CalendarDays size={15} aria-hidden="true" />
                  </span>
                  <span>{formatDate(e.event_date) || e.event_date}</span>
                </Link>
              ),
            },
            {
              key: "artist",
              header: "Artist / Bill",
              sortValue: (e) => e.artist?.name || "",
              render: (e) => (
                <span className="font-bold text-admin-ink">
                  {e.artist?.name || "Tromagnon Showcase"}
                </span>
              ),
            },
            {
              key: "venue",
              header: "Venue & City",
              sortValue: (e) => e.city || "",
              render: (e) => (
                <div className="flex items-start gap-1.5">
                  <MapPin size={14} className="mt-0.5 shrink-0 text-admin-sub" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-semibold text-admin-ink">
                      {e.venue}
                    </p>
                    <p className="truncate text-[12.5px] text-admin-sub">
                      {e.city}, {e.country}
                    </p>
                  </div>
                </div>
              ),
            },
            {
              key: "tickets",
              header: "Tickets",
              render: (e) =>
                e.ticket_url ? (
                  <a
                    href={e.ticket_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[12px] font-semibold text-admin-forest shadow-sm ring-1 ring-admin-border/70 transition hover:bg-admin-lime-soft"
                  >
                    <span>Link</span>
                    <ExternalLink size={11} aria-hidden="true" />
                  </a>
                ) : (
                  <span className="text-[12.5px] text-admin-sub">At door</span>
                ),
            },
            {
              key: "status",
              header: "Status",
              sortValue: (e) => e.status,
              render: (e) => <StatusBadge status={e.status} />,
            },
            {
              key: "actions",
              header: "",
              className: "w-24 text-right",
              render: (e) => (
                <RowActions
                  editHref={`/admin/live/${e.id}`}
                  onDelete={() => setDeleteIds([e.id])}
                  label={e.venue}
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
            ? `Delete ${deleteIds.length} shows?`
            : "Delete show?"
        }
        message="This permanently removes the show from the live calendar."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteIds([])}
      />
    </div>
  );
}
