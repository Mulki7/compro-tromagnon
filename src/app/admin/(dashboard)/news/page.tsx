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
} from "@/components/admin/formStyles";
import { deleteNews, getAdminNews } from "@/lib/api/admin/news";
import { News } from "@/types/models";
import { formatDate, getMediaUrl } from "@/lib/utils";

export default function AdminNewsPage() {
  const { onMenuClick } = useAdminShell();
  const [items, setItems] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await getAdminNews());
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load news"));
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
      await deleteNews(deleteId);
      setDeleteId(null);
      await load();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete article"));
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <AdminHeader
        title="News"
        subtitle="Journal & dispatch"
        onMenuClick={onMenuClick}
        actions={
          <Link href="/admin/news/create" className={btnPrimary}>
            <Plus size={14} />
            Create News
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
          rowKey={(n) => n.id}
          emptyMessage="No articles yet. Write your first dispatch."
          columns={[
            {
              key: "cover",
              header: "Cover",
              render: (n) => (
                <div className="relative h-12 w-16 overflow-hidden bg-neutral-100">
                  <Image
                    src={getMediaUrl(n.cover_image_url)}
                    alt={n.title}
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
              render: (n) => (
                <div>
                  <p className="font-medium text-black">{n.title}</p>
                  <p className="font-mono text-[10px] text-neutral-400">
                    {n.author || "—"}
                  </p>
                </div>
              ),
            },
            {
              key: "date",
              header: "Published",
              render: (n) => (
                <span className="font-mono text-[10px] text-neutral-500">
                  {formatDate(n.published_at) || "—"}
                </span>
              ),
            },
            {
              key: "status",
              header: "Status",
              render: (n) => <StatusBadge status={n.status} />,
            },
            {
              key: "actions",
              header: "Actions",
              render: (n) => (
                <div className="flex gap-2">
                  <Link href={`/admin/news/${n.id}`} className={btnEdit}>
                    <Pencil size={12} />
                    Edit
                  </Link>
                  <button
                    type="button"
                    className={btnDanger}
                    onClick={() => setDeleteId(n.id)}
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
        title="Delete article?"
        message="This will remove the news article from the CMS."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
