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
import {
  deleteHeroBanner,
  getAdminHeroBanners,
} from "@/lib/api/admin/hero";
import { HeroBanner } from "@/types/models";
import { getMediaUrl } from "@/lib/utils";

export default function AdminHeroPage() {
  const { onMenuClick } = useAdminShell();
  const [items, setItems] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getAdminHeroBanners();
      setItems([...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load banners"));
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
      await deleteHeroBanner(deleteId);
      setDeleteId(null);
      await load();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete banner"));
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <AdminHeader
        title="Hero Banners"
        subtitle="Homepage slider"
        onMenuClick={onMenuClick}
        actions={
          <Link href="/admin/hero/create" className={btnPrimary}>
            <Plus size={14} />
            Add Banner
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
          rowKey={(h) => h.id}
          emptyMessage="No hero banners yet."
          columns={[
            {
              key: "preview",
              header: "Preview",
              render: (h) => (
                <div className="relative h-12 w-20 overflow-hidden bg-neutral-100">
                  <Image
                    src={getMediaUrl(h.image_url)}
                    alt={h.title}
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
              render: (h) => (
                <div>
                  <p className="font-medium text-black">{h.title}</p>
                  <p className="text-xs text-neutral-500 line-clamp-1">
                    {h.subtitle || "—"}
                  </p>
                </div>
              ),
            },
            {
              key: "order",
              header: "Order",
              render: (h) => (
                <span className="font-mono text-xs">{h.order}</span>
              ),
            },
            {
              key: "active",
              header: "Status",
              render: (h) => (
                <StatusBadge status={String(h.is_active !== false)} />
              ),
            },
            {
              key: "actions",
              header: "Actions",
              render: (h) => (
                <div className="flex gap-2">
                  <Link href={`/admin/hero/${h.id}`} className={btnEdit}>
                    <Pencil size={12} />
                    Edit
                  </Link>
                  <button
                    type="button"
                    className={btnDanger}
                    onClick={() => setDeleteId(h.id)}
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
        title="Delete banner?"
        message="This will remove the hero banner from the homepage slider."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
