"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminTable from "@/components/admin/AdminTable";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { FilterTabs, RowActions, SearchField } from "@/components/admin/ListControls";
import { useAdminShell } from "@/components/admin/AdminShellContext";
import { btnPrimarySm, getErrorMessage } from "@/components/admin/formStyles";
import { deleteLiveEvent, getAdminLiveEvents } from "@/lib/api/admin/live";
import { LiveEvent } from "@/types/models";
import { formatDate } from "@/lib/utils";

type Filter = "all" | "upcoming" | "past";

export default function AdminLivePage() {
  const { onMenuClick } = useAdminShell();
  const [items, setItems] = useState<LiveEvent[]>([]);
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
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteLiveEvent(deleteId);
      setDeleteId(null);
      await load();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete event"));
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  };

  const upcoming = items.filter((e) => e.status === "upcoming").length;

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((e) => {
      if (filter === "upcoming" && e.status !== "upcoming") return false;
      if (filter === "past" && e.status === "upcoming") return false;
      if (!q) return true;
      return (
        (e.artist?.name || "").toLowerCase().includes(q) ||
        (e.venue || "").toLowerCase().includes(q) ||
        (e.city || "").toLowerCase().includes(q)
      );
    });
  }, [items, filter, query]);

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:overflow-hidden">
      <AdminHeader
        title="Live"
        subtitle="Shows and tour dates"
        onMenuClick={onMenuClick}
        actions={
          <Link href="/admin/live/create" className={btnPrimarySm}>
            <Plus size={15} aria-hidden="true" />
            Schedule show
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
            { key: "upcoming", label: "Upcoming", count: upcoming },
            { key: "past", label: "Past", count: items.length - upcoming },
          ]}
        />
        <div className="pb-2.5">
          <SearchField value={query} onChange={setQuery} placeholder="Search artist, venue, city" />
        </div>
      </div>

      <AdminTable
        loading={loading}
        data={rows}
        rowKey={(e) => e.id}
        emptyMessage={items.length === 0 ? "No shows scheduled." : "No shows match."}
        emptyAction={
          items.length === 0 && (
            <Link href="/admin/live/create" className={btnPrimarySm}>
              <Plus size={15} aria-hidden="true" />
              Schedule the first show
            </Link>
          )
        }
        columns={[
          {
            key: "date",
            header: "Date",
            sortValue: (e) => e.event_date || "",
            render: (e) => (
              <span className="font-semibold tabular-nums">
                {formatDate(e.event_date) || e.event_date}
              </span>
            ),
          },
          {
            key: "artist",
            header: "Artist",
            sortValue: (e) => e.artist?.name || "",
            render: (e) => (
              <span className="font-semibold">{e.artist?.name || "Showcase"}</span>
            ),
          },
          {
            key: "venue",
            header: "Venue",
            sortValue: (e) => e.city || "",
            render: (e) => (
              <div className="min-w-0">
                <p className="truncate text-[15px]">{e.venue}</p>
                <p className="truncate text-[13px] text-satelit-muted">
                  {e.city}, {e.country}
                </p>
              </div>
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
            className: "w-24 pr-0 text-right",
            render: (e) => (
              <RowActions
                editHref={`/admin/live/${e.id}`}
                onDelete={() => setDeleteId(e.id)}
                label={e.venue}
              />
            ),
          },
        ]}
      />

      <ConfirmDialog
        open={!!deleteId}
        title="Delete show?"
        message="This removes the show from the schedule."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
