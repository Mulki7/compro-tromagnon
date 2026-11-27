export const inputClass =
  "w-full rounded-2xl border border-admin-border bg-admin-muted/70 px-4 py-2.5 text-[14px] text-admin-ink placeholder:text-admin-sub/70 transition-colors hover:border-admin-forest/30 focus:border-admin-forest focus:bg-white focus:outline-none focus:ring-2 focus:ring-admin-forest/15";

export const labelClass =
  "mb-1.5 block text-[12px] font-semibold tracking-[0.02em] text-admin-sub";

export const formSectionClass =
  "space-y-5 rounded-[24px] border border-admin-border/80 bg-white p-5 shadow-admin-card sm:p-6";

export const formSectionTitleClass =
  "text-[16px] font-bold tracking-[-0.015em] text-admin-ink";

export const formErrorClass =
  "rounded-2xl border border-admin-danger/25 bg-admin-danger-soft px-4 py-3 text-[13.5px] font-medium text-admin-danger";

export const formLoadingClass =
  "flex flex-1 items-center justify-center gap-2.5 py-24 text-[14px] font-medium text-admin-sub";

export const btnPrimary =
  "inline-flex h-11 items-center justify-center gap-2.5 rounded-full bg-admin-forest px-5 text-[14px] font-semibold text-white transition hover:bg-admin-forest-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-forest focus-visible:ring-offset-2 disabled:opacity-50";

export const btnPrimaryPill =
  "group inline-flex h-11 items-center justify-center gap-2.5 rounded-full bg-admin-forest pl-4 pr-1.5 text-[13.5px] font-semibold text-white shadow-sm transition hover:bg-admin-forest-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-forest focus-visible:ring-offset-2 disabled:opacity-50";

export const btnPrimarySm =
  "group inline-flex h-10 items-center justify-center gap-2 rounded-full bg-admin-forest pl-4 pr-1.5 text-[13.5px] font-semibold text-white shadow-sm transition hover:bg-admin-forest-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-forest focus-visible:ring-offset-2 disabled:opacity-50";

export const btnLime =
  "group inline-flex h-11 items-center justify-center gap-2.5 rounded-full bg-admin-lime pl-5 pr-2 text-[14px] font-bold text-admin-forest transition hover:bg-admin-lime-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-lime focus-visible:ring-offset-2 focus-visible:ring-offset-admin-forest disabled:opacity-50";

export const btnSecondary =
  "inline-flex h-10 items-center justify-center gap-2 rounded-full border border-admin-border bg-white px-4 text-[13.5px] font-semibold text-admin-ink transition hover:border-admin-forest/30 hover:bg-admin-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-forest focus-visible:ring-offset-2 disabled:opacity-50";

export const btnDanger =
  "inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-admin-danger/25 bg-admin-danger-soft px-4 text-[13.5px] font-semibold text-admin-danger transition hover:bg-admin-danger hover:text-white disabled:opacity-50";

export const btnEdit =
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-admin-muted px-3.5 text-[13px] font-semibold text-admin-ink transition hover:bg-admin-lime-soft";

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

export function downloadCsv(filename: string, headers: string[], rows: (string | number | undefined | null)[][]) {
  const escape = (val: string | number | undefined | null) => {
    const s = String(val ?? "");
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const csv = [headers.map(escape).join(","), ...rows.map((r) => r.map(escape).join(","))].join("\n");
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
