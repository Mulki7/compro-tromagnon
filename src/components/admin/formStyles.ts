/* DESIGN.md v1.4 aligned Admin primitives:
   - 100% Plus Jakarta Sans (font-admin) across all Admin Console controls, inputs, headings, and buttons
   - Salmont (font-display) is strictly reserved for >=28px display headlines & never used on forms, buttons, or tables
   - Subtle rounded corners: 6px (chips/badges), 8px (inputs/buttons), 12px (cards/panels)
   - Strong 1px borders (#767D75) on interactive inputs & secondary controls */

export const inputClass =
  "h-10 w-full rounded-lg border border-admin-border-strong bg-admin-canvas px-3.5 py-2 font-admin text-[16px] leading-[1.45] text-admin-ink placeholder:text-admin-sub/70 transition-colors duration-[120ms] ease-tromagnon hover:border-admin-forest focus:border-admin-forest focus:bg-admin-surface focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-forest sm:text-[14.5px]";

export const textareaClass =
  "w-full rounded-lg border border-admin-border-strong bg-admin-canvas px-3.5 py-2.5 font-admin text-[16px] leading-[1.6] text-admin-ink placeholder:text-admin-sub/70 transition-colors duration-[120ms] ease-tromagnon hover:border-admin-forest focus:border-admin-forest focus:bg-admin-surface focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-forest sm:text-[15px]";

export const editorialTextareaClass = textareaClass;

export const labelClass =
  "mb-1.5 block font-admin text-[13px] font-medium leading-[1.35] text-admin-sub";

export const formSectionClass =
  "space-y-4 rounded-xl border border-admin-border bg-admin-surface p-5";

export const formSectionTitleClass =
  "font-admin text-[18px] font-bold leading-[1.2] tracking-[-0.015em] text-admin-ink";

export const formErrorClass =
  "rounded-lg border border-admin-danger bg-admin-danger-soft px-4 py-2.5 font-admin text-[14px] font-medium text-admin-danger";

export const formLoadingClass =
  "flex flex-1 items-center justify-center gap-2.5 py-20 font-admin text-[14.5px] font-medium text-admin-sub";

export const btnPrimary =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-admin-forest-soft px-4 font-admin text-[13.5px] font-semibold text-[#F1F2EE] transition-colors duration-[120ms] ease-tromagnon hover:bg-admin-forest disabled:bg-admin-elevated disabled:text-admin-disabled";

export const btnPrimaryPill =
  "group inline-flex h-10 items-center justify-center gap-2.5 rounded-lg bg-admin-forest-soft pl-3.5 pr-1.5 font-admin text-[13.5px] font-semibold text-[#F1F2EE] transition-colors duration-[120ms] ease-tromagnon hover:bg-admin-forest disabled:bg-admin-elevated disabled:text-admin-disabled";

export const btnPrimarySm =
  "group inline-flex h-10 items-center justify-center gap-2.5 rounded-lg bg-admin-forest-soft pl-3.5 pr-1.5 font-admin text-[13.5px] font-semibold text-[#F1F2EE] transition-colors duration-[120ms] ease-tromagnon hover:bg-admin-forest disabled:bg-admin-elevated disabled:text-admin-disabled";

export const btnLime =
  "group inline-flex h-10 items-center justify-center gap-2.5 rounded-lg bg-admin-lime pl-4 pr-1.5 font-admin text-[13.5px] font-semibold text-admin-on-lime transition-colors duration-[120ms] ease-tromagnon hover:bg-admin-lime-hover disabled:bg-admin-elevated disabled:text-admin-disabled";

export const btnSecondary =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-admin-border-strong bg-admin-surface px-3.5 font-admin text-[13.5px] font-semibold text-admin-ink transition-colors duration-[120ms] ease-tromagnon hover:bg-admin-elevated disabled:border-admin-border disabled:bg-admin-elevated disabled:text-admin-disabled";

export const btnDanger =
  "inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-admin-danger bg-admin-danger-soft px-3.5 font-admin text-[13.5px] font-semibold text-admin-danger transition-colors duration-[120ms] ease-tromagnon hover:bg-admin-danger hover:text-[#F1F2EE] disabled:border-admin-border disabled:bg-admin-elevated disabled:text-admin-disabled";

export const btnEdit =
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-admin-border-strong bg-admin-muted px-3 font-admin text-[13.5px] font-semibold text-admin-ink transition-colors duration-[120ms] ease-tromagnon hover:bg-admin-elevated";

export function parseStringArray(value: string | string[] | null | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  const s = value.trim();
  if (s.startsWith("[") && s.endsWith("]")) {
    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
    } catch {
      return s
        .slice(1, -1)
        .split(",")
        .map((x) => x.trim().replace(/^"|"$/g, ""))
        .filter(Boolean);
    }
  }
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

export function getErrorMessage(err: unknown, fallback = "Something went wrong"): string {
  const e = err as { response?: { data?: { message?: string } }; message?: string };
  return e?.response?.data?.message || e?.message || fallback;
}

export function downloadCsv(
  filename: string,
  headers: string[],
  rows: (string | number | undefined | null)[][]
) {
  const escape = (val: string | number | undefined | null) => {
    const s = String(val ?? "");
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const csv = [
    headers.map(escape).join(","),
    ...rows.map((r) => r.map(escape).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
