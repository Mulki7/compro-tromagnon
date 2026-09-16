"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminTable from "@/components/admin/AdminTable";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useAdminShell } from "@/components/admin/AdminShellContext";
import {
  btnDanger,
  btnEdit,
  btnPrimary,
  getErrorMessage,
} from "@/components/admin/formStyles";
import { deleteLiveEvent, getAdminLiveEvents } from "@/lib/api/admin/live";
import { LiveEvent } from "@/types/models";
import { formatDate } from "@/lib/utils";

export default function AdminLivePage() {
  const { onMenuClick } = useAdminShell();
  const [items, setItems] = useState<LiveEvent[]>([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div>
      <AdminHeader
        title="Live Events"
        subtitle="Tour dates & shows"
        onMenuClick={onMenuClick}
        actions={
          <Link href="/admin/live/create" className={btnPrimary}>
            <Plus size={14} />
            Schedule Live
          </Link>
        }
      />
      <div className="space-y-4 p-4 sm:p-6">
        {error && (
          <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <AdminTable
          loading={loading}
          data={items}
          rowKey={(e) => e.id}
          emptyMessage="No live events scheduled."
          columns={[
            {
              key: "date",
              header: "Date",
              render: (e) => (
                <span className="font-mono text-xs font-medium">
                  {formatDate(e.event_date) || e.event_date}
                </span>
              ),
            },
            {
              key: "artist",
              header: "Artist",
              render: (e) => (
                <span className="text-sm">{e.artist?.name || "—"}</span>
              ),
            },
            {
              key: "venue",
              header: "Venue / City",
              render: (e) => (
                <div>
                  <p className="font-medium">{e.venue}</p>
                  <p className="text-xs text-neutral-500">
                    {e.city}, {e.country}
                  </p>
                </div>
              ),
            },
            {
              key: "status",
              header: "Status",
              render: (e) => <StatusBadge status={e.status} />,
            },
            {
              key: "actions",
              header: "Actions",
              render: (e) => (
                <div className="flex gap-2">
                  <Link href={`/admin/live/${e.id}`} className={btnEdit}>
                    <Pencil size={12} />
                    Edit
                  </Link>
                  <button
                    type="button"
                    className={btnDanger}
                    onClick={() => setDeleteId(e.id)}
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                </div>
              ),
            },
          ]}
        />
      </div>
      <ConfirmDialog
        open={!!deleteId}
        title="Delete event?"
        message="This will remove the live event from the schedule."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
