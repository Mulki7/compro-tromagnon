"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
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
  parseStringArray,
} from "@/components/admin/formStyles";
import { deleteRelease, getAdminReleases } from "@/lib/api/admin/releases";
import { Release } from "@/types/models";
import { getMediaUrl } from "@/lib/utils";

export default function AdminReleasesPage() {
  const { onMenuClick } = useAdminShell();
  const [items, setItems] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div>
      <AdminHeader
        title="Releases"
        subtitle="Catalog management"
        onMenuClick={onMenuClick}
        actions={
          <Link href="/admin/releases/create" className={btnPrimary}>
            <Plus size={14} />
            Add Release
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
          rowKey={(r) => r.id}
          emptyMessage="No releases yet. Add your first catalog entry."
          columns={[
            {
              key: "art",
              header: "Artwork",
              render: (r) => (
                <div className="relative h-12 w-12 overflow-hidden bg-neutral-100">
                  <Image
                    src={getMediaUrl(r.artwork_url)}
                    alt={r.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              ),
            },
            {
              key: "title",
              header: "Title",
              render: (r) => (
                <div>
                  <p className="font-medium text-black">{r.title}</p>
                  <p className="text-xs text-neutral-500">
                    {r.artist?.name || "—"}
                  </p>
                </div>
              ),
            },
            {
              key: "year",
              header: "Year",
              render: (r) => (
                <span className="font-mono text-xs">{r.release_year}</span>
              ),
            },
            {
              key: "format",
              header: "Format",
              render: (r) => (
                <span className="font-mono text-[10px] uppercase text-neutral-600">
                  {parseStringArray(r.format).join(" · ") || "—"}
                </span>
              ),
            },
            {
              key: "status",
              header: "Status",
              render: (r) => <StatusBadge status={r.status} />,
            },
            {
              key: "actions",
              header: "Actions",
              render: (r) => (
                <div className="flex gap-2">
                  <Link href={`/admin/releases/${r.id}`} className={btnEdit}>
                    <Pencil size={12} />
                    Edit
                  </Link>
                  <button
                    type="button"
                    className={btnDanger}
                    onClick={() => setDeleteId(r.id)}
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
        title="Delete release?"
        message="This will remove the release from the catalog."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
