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
      setError(getErrorMessage(err, "Failed to load shows"));
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
      setError(getErrorMessage(err, "Failed to delete show"));
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
    <div className="flex min-h-0 flex-1 flex-col pb-3 lg:overflow-hidden">
      <AdminHeader
        title="Shows"
        actions={<PrimaryCtaPill href="/admin/live/create" label="Schedule show" />}
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
              key: "upcoming",
              label: "Upcoming",
              count: upcomingCount,
              dotColor: "bg-admin-info",
              tone: "lime",
            },
            {
              key: "past",
              label: "Past",
              count: pastCount,
              dotColor: "bg-admin-sub",
            },
            {
              key: "cancelled",
              label: "Cancelled",
              count: cancelledCount,
              dotColor: "bg-admin-danger",
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
                placeholder="Search artist, venue, city…"
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
            items.length === 0 ? "No shows scheduled." : "No matching shows."
          }
          emptyAction={
            items.length === 0 && (
              <PrimaryCtaPill href="/admin/live/create" label="Schedule show" />
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
                  className="inline-flex items-center gap-2.5 font-admin text-[13.5px] font-semibold tabular-nums text-admin-ink hover:text-admin-forest-soft"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-admin-border bg-admin-surface text-admin-forest-soft">
                    <CalendarDays size={14} aria-hidden="true" />
                  </span>
                  <span>{formatDate(e.event_date) || e.event_date}</span>
                </Link>
              ),
            },
            {
              key: "artist",
              header: "Artist",
              sortValue: (e) => e.artist?.name || "",
              render: (e) => (
                <span className="font-admin text-[15px] font-semibold tracking-[-0.01em] text-admin-ink">
                  {e.artist?.name || "Showcase"}
                </span>
              ),
            },
            {
              key: "venue",
              header: "Venue",
              sortValue: (e) => e.city || "",
              render: (e) => (
                <div className="flex items-start gap-1.5">
                  <MapPin size={14} className="mt-0.5 shrink-0 text-admin-sub" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="truncate font-admin text-[14px] font-medium text-admin-ink">
                      {e.venue}
                    </p>
                    <p className="truncate font-admin text-[12.5px] text-admin-sub">
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
                    className="inline-flex items-center gap-1 rounded-md border border-admin-border-strong bg-admin-surface px-2.5 py-1 font-admin text-[12px] font-semibold text-admin-forest-soft underline underline-offset-2 transition-colors duration-[120ms] hover:bg-admin-elevated hover:text-admin-forest"
                  >
                    <span>Link</span>
                    <ExternalLink size={11} aria-hidden="true" />
                  </a>
                ) : (
                  <span className="font-admin text-[13px] text-admin-sub">Door</span>
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
        message="This removes the show from the schedule."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteIds([])}
      />
    </div>
  );
}
