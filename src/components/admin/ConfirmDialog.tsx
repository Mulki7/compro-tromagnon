"use client";

import { useEffect, useId, useRef } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  loading = false,
  danger = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId();
  const messageId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelBtnRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    openerRef.current = document.activeElement as HTMLElement | null;
    cancelBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) {
        e.preventDefault();
        onCancel();
        return;
      }

      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      openerRef.current?.focus();
    };
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#111111]/45"
        onClick={loading ? undefined : onCancel}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={messageId}
        className="relative w-full max-w-md rounded-xl border border-admin-border-strong bg-admin-surface p-6 shadow-admin-pop"
      >
        <div className="flex items-start gap-3.5">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
              danger
                ? "bg-admin-danger-soft text-admin-danger"
                : "bg-admin-success-soft text-admin-forest-soft"
            }`}
          >
            <AlertTriangle size={19} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h2
              id={titleId}
              className="font-display text-[20px] font-bold tracking-[-0.015em] text-admin-ink"
            >
              {title}
            </h2>
            <p
              id={messageId}
              className="mt-1 font-admin text-[14.5px] leading-[1.55] text-admin-sub"
            >
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            ref={cancelBtnRef}
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="h-10 rounded-lg border border-admin-border-strong bg-admin-surface px-4 font-display text-[14px] font-semibold text-admin-ink transition-colors duration-[120ms] hover:bg-admin-elevated disabled:border-admin-border disabled:bg-admin-elevated disabled:text-admin-disabled"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`inline-flex h-10 items-center gap-2 rounded-lg px-4 font-display text-[14px] font-semibold text-[#F1F2EE] transition-colors duration-[120ms] disabled:bg-admin-elevated disabled:text-admin-disabled ${
              danger
                ? "bg-admin-danger hover:bg-[#821C16]"
                : "bg-admin-forest-soft hover:bg-admin-forest"
            }`}
          >
            {loading && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
