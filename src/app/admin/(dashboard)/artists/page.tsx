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
import { deleteArtist, getAdminArtists } from "@/lib/api/admin/artists";
import { Artist } from "@/types/models";
import { formatGenre, getMediaUrl } from "@/lib/utils";

export default function AdminArtistsPage() {
  const { onMenuClick } = useAdminShell();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setArtists(await getAdminArtists());
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

  return (
    <div>
      <AdminHeader
        title="Artists"
        subtitle="Roster management"
        onMenuClick={onMenuClick}
        actions={
          <Link href="/admin/artists/create" className={btnPrimary}>
            <Plus size={14} />
            Add Artist
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
          data={artists}
          rowKey={(a) => a.id}
          emptyMessage="No artists yet. Add your first roster member."
          columns={[
            {
              key: "photo",
              header: "Photo",
              render: (a) => (
                <div className="relative h-12 w-12 overflow-hidden bg-neutral-100">
                  <Image
                    src={getMediaUrl(a.photo_url)}
                    alt={a.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              ),
            },
            {
              key: "name",
              header: "Name",
              render: (a) => (
                <div>
                  <p className="font-medium text-black">{a.name}</p>
                  <p className="font-mono text-[10px] text-neutral-400">
                    /{a.slug}
                  </p>
                </div>
              ),
            },
            {
              key: "genre",
              header: "Genre",
              render: (a) => (
                <span className="text-xs text-neutral-600">
                  {formatGenre(parseStringArray(a.genre))}
                </span>
              ),
            },
            {
              key: "status",
              header: "Status",
              render: (a) => <StatusBadge status={a.status} />,
            },
            {
              key: "actions",
              header: "Actions",
              render: (a) => (
                <div className="flex gap-2">
                  <Link href={`/admin/artists/${a.id}`} className={btnEdit}>
                    <Pencil size={12} />
                    Edit
                  </Link>
                  <button
                    type="button"
                    className={btnDanger}
                    onClick={() => setDeleteId(a.id)}
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
        title="Delete artist?"
        message="This will soft-delete the artist from the roster. This action can be irreversible depending on the API."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
