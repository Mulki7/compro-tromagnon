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
  checklistTitle = "Checklist",
}: FormSummaryCardProps) {
  const completedCount = checks ? checks.filter((c) => c.done).length : 0;
  const totalCount = checks ? checks.length : 0;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
      {/* Deep Pine Summary Panel */}
      <div className="rounded-xl border border-[#16302C] bg-admin-forest p-5 text-[#F1F2EE]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-display text-[19px] font-bold text-[#F1F2EE]">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-0.5 truncate font-admin text-[12.5px] text-[#B8D0C9]">
                {subtitle}
              </p>
            )}
          </div>
          {totalCount > 0 && (
            <span className="shrink-0 rounded-md bg-admin-forest-soft px-2 py-0.5 font-admin text-[12px] font-semibold tabular-nums text-admin-lime">
              {pct}%
            </span>
          )}
        </div>

        <dl className="mt-4 space-y-2 border-b border-white/15 pb-4 font-admin text-[13.5px]">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between gap-3">
              <dt className="text-[#B8D0C9]">{r.label}</dt>
              <dd className="max-w-[60%] truncate text-right font-semibold text-[#F1F2EE]">
                {r.value || "—"}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-4">
          <p className="font-admin text-[12px] font-medium text-[#B8D0C9]">
            {highlightLabel}
          </p>
          <p className="mt-0.5 truncate font-display text-[26px] font-bold leading-tight tracking-[-0.02em] text-admin-lime tabular-nums">
            {highlightValue}
          </p>
        </div>

        {warningText && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-admin-danger/40 bg-admin-danger-soft px-3 py-2 font-admin text-[12.5px] font-medium text-admin-danger">
            <AlertCircle size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>{warningText}</span>
          </div>
        )}

        <div className="mt-4 space-y-2">
          <button
            type={submitType}
            disabled={saving}
            onClick={onSubmitClick}
            className={`${btnLime} w-full justify-between`}
          >
            <span className="flex items-center gap-2">
              {saving && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
              {submitLabel}
            </span>
            <span
              aria-hidden="true"
              className="flex h-7 w-7 items-center justify-center rounded-md bg-admin-forest text-[#F1F2EE] transition-transform duration-[120ms] ease-tromagnon group-hover:translate-x-0.5"
            >
              <ArrowRight size={14} strokeWidth={2.2} />
            </span>
          </button>

          {onSecondaryAction && (
            <button
              type="button"
              disabled={saving}
              onClick={onSecondaryAction.onClick}
              className="flex h-10 w-full items-center justify-center rounded-lg border border-[#7DB4A9]/40 bg-admin-forest-soft font-display text-[14px] font-semibold text-[#F1F2EE] transition-colors duration-[120ms] hover:bg-admin-forest-deep disabled:bg-admin-elevated disabled:text-admin-disabled"
            >
              {onSecondaryAction.label}
            </button>
          )}
        </div>
      </div>

      {/* Checklist Card */}
      {checks && checks.length > 0 && (
        <div className="rounded-xl border border-admin-border bg-admin-muted p-4 text-admin-ink">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-[16px] font-bold text-admin-ink">
              {checklistTitle}
            </h3>
            <span className="font-admin text-[12.5px] font-semibold tabular-nums text-admin-forest">
              {completedCount}/{totalCount}
            </span>
          </div>

          <div
            aria-hidden="true"
            className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-admin-canvas"
          >
            <div
              className="h-full rounded-full bg-admin-forest-soft transition-all duration-[200ms] ease-tromagnon"
              style={{ width: `${pct}%` }}
            />
          </div>

          <ul className="mt-3 space-y-1.5">
            {checks.map((c) => (
              <li
                key={c.label}
                className="flex items-center gap-2 rounded-lg border border-admin-border bg-admin-surface px-3 py-2 font-admin text-[13px] text-admin-ink"
              >
                {c.done ? (
                  <CheckCircle2
                    size={15}
                    className="shrink-0 text-admin-success"
                    aria-hidden="true"
                  />
                ) : (
                  <Circle
                    size={15}
                    className="shrink-0 text-admin-border-strong"
                    aria-hidden="true"
                  />
                )}
                <span className={c.done ? "font-medium" : "text-admin-sub"}>
                  {c.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
