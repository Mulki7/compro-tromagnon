"use client";

import { AlertCircle, ArrowRight, CheckCircle2, Circle, Loader2 } from "lucide-react";
import { btnLime } from "@/components/admin/formStyles";

export interface SummaryRow {
  label: string;
  value: string;
}

export interface ReadinessCheck {
  label: string;
  done: boolean;
}

interface FormSummaryCardProps {
  title: string;
  subtitle?: string;
  rows: SummaryRow[];
  highlightLabel: string;
  highlightValue: string;
  warningText?: string;
  submitLabel: string;
  saving?: boolean;
  onSecondaryAction?: {
    label: string;
    onClick: () => void;
  };
  submitType?: "submit" | "button";
  onSubmitClick?: () => void;
  checks?: ReadinessCheck[];
  checklistTitle?: string;
  checklistSubtitle?: string;
}

export default function FormSummaryCard({
  title,
  subtitle,
  rows,
  highlightLabel,
  highlightValue,
  warningText,
  submitLabel,
  saving = false,
  onSecondaryAction,
  submitType = "submit",
  onSubmitClick,
  checks,
  checklistTitle = "Asset readiness",
  checklistSubtitle = "Verify before publishing to the live archive",
}: FormSummaryCardProps) {
  const completedCount = checks ? checks.filter((c) => c.done).length : 0;
  const totalCount = checks ? checks.length : 0;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <aside className="space-y-4 lg:sticky lg:top-5 lg:self-start">
      {/* Deep Forest Summary Panel */}
      <div className="rounded-[24px] bg-admin-forest p-5 text-white shadow-admin-card">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-[17px] font-bold tracking-[-0.015em] text-white">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-0.5 truncate text-[12.5px] text-[#9DC0A9]">
                {subtitle}
              </p>
            )}
          </div>
          {totalCount > 0 && (
            <span className="shrink-0 rounded-full bg-admin-forest-soft px-2.5 py-1 text-[11.5px] font-bold tabular-nums text-admin-lime">
              {pct}%
            </span>
          )}
        </div>

        <dl className="mt-4 space-y-2.5 border-b border-white/10 pb-4 text-[13px]">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between gap-3">
              <dt className="text-[#A8C8B3]">{r.label}</dt>
              <dd className="max-w-[60%] truncate text-right font-semibold text-white">
                {r.value || "—"}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-4">
          <p className="text-[12px] font-medium text-[#A8C8B3]">{highlightLabel}</p>
          <p className="mt-1 truncate text-[28px] font-bold leading-tight tracking-[-0.03em] text-admin-lime tabular-nums">
            {highlightValue}
          </p>
        </div>

        {warningText && (
          <div className="mt-4 flex items-start gap-2 rounded-2xl bg-[#FCEAEA] px-3.5 py-2.5 text-[12.5px] font-semibold text-[#991B1B]">
            <AlertCircle size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>{warningText}</span>
          </div>
        )}

        <div className="mt-5 space-y-2.5">
          <button
            type={submitType}
            disabled={saving}
            onClick={onSubmitClick}
            className={`${btnLime} w-full justify-between`}
          >
            <span className="flex items-center gap-2">
              {saving && <Loader2 size={15} className="animate-spin" aria-hidden="true" />}
              {submitLabel}
            </span>
            <span
              aria-hidden="true"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-admin-forest text-admin-lime transition-transform duration-150 group-hover:translate-x-0.5"
            >
              <ArrowRight size={14} strokeWidth={2.2} />
            </span>
          </button>

          {onSecondaryAction && (
            <button
              type="button"
              disabled={saving}
              onClick={onSecondaryAction.onClick}
              className="flex h-10 w-full items-center justify-center rounded-full border border-white/15 bg-admin-forest-soft/70 text-[13.5px] font-semibold text-[#E5F2EA] transition hover:bg-admin-forest-soft disabled:opacity-50"
            >
              {onSecondaryAction.label}
            </button>
          )}
        </div>
      </div>

      {/* Sage Readiness Card */}
      {checks && checks.length > 0 && (
        <div className="rounded-[24px] bg-admin-sage p-5 text-admin-forest">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <h3 className="text-[15px] font-bold tracking-[-0.015em] text-admin-forest">
                {checklistTitle}
              </h3>
              <p className="mt-0.5 text-[12px] text-admin-forest/75">
                {checklistSubtitle}
              </p>
            </div>
            <span className="text-[13px] font-bold tabular-nums text-admin-forest">
              {completedCount}/{totalCount}
            </span>
          </div>

          <div
            aria-hidden="true"
            className="mt-3.5 h-2 w-full overflow-hidden rounded-full bg-white/60"
          >
            <div
              className="h-full rounded-full bg-admin-forest transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>

          <ul className="mt-3.5 space-y-2">
            {checks.map((c) => (
              <li
                key={c.label}
                className="flex items-center justify-between gap-2 rounded-2xl bg-white/75 px-3 py-2 text-[13px]"
              >
                <span className="flex items-center gap-2 font-medium text-admin-ink">
                  {c.done ? (
                    <CheckCircle2
                      size={15}
                      className="shrink-0 text-admin-forest"
                      aria-hidden="true"
                    />
                  ) : (
                    <Circle
                      size={15}
                      className="shrink-0 text-admin-sub/50"
                      aria-hidden="true"
                    />
                  )}
                  {c.label}
                </span>
                <span
                  className={`text-[11.5px] font-semibold ${
                    c.done ? "text-admin-forest" : "text-admin-sub"
                  }`}
                >
                  {c.done ? "Ready" : "Missing"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
