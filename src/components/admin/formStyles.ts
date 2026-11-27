export const inputClass =
  "w-full rounded-lg border border-satelit-border bg-satelit-bg px-3.5 py-2.5 text-[15px] text-satelit-ink placeholder:text-satelit-muted/70 transition focus:border-satelit-accent focus:outline-none focus:ring-2 focus:ring-satelit-accent/20";

export const labelClass =
  "mb-1.5 block text-[13px] font-semibold uppercase tracking-[0.07em] text-satelit-muted";

export const formSectionClass =
  "space-y-4 rounded-xl border border-satelit-border bg-satelit-surface/45 p-5 sm:p-6";

export const formErrorClass =
  "rounded-xl border border-satelit-danger/30 bg-satelit-danger/10 px-4 py-3 text-[14px] font-medium text-satelit-danger";

export const formLoadingClass =
  "flex items-center justify-center gap-2.5 py-24 text-[14px] font-medium text-satelit-muted";

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-satelit-accent px-4 py-2.5 text-[14px] font-semibold text-satelit-on-accent transition hover:bg-satelit-accent-hover disabled:opacity-50";

export const btnPrimarySm =
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-satelit-accent px-3.5 text-[14px] font-semibold text-satelit-on-accent transition hover:bg-satelit-accent-hover";

export const btnSecondary =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-satelit-border bg-transparent px-4 py-2.5 text-[14px] font-semibold text-satelit-ink transition hover:bg-satelit-surface disabled:opacity-50";

export const btnDanger =
  "inline-flex items-center justify-center gap-1.5 rounded-lg border border-satelit-danger/40 bg-transparent px-3 py-2 text-[13px] font-semibold text-satelit-danger transition hover:bg-satelit-danger/10";

export const btnEdit =
  "inline-flex items-center justify-center gap-1.5 rounded-lg bg-satelit-surface px-3 py-2 text-[13px] font-semibold text-satelit-ink transition hover:bg-satelit-elevated";

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
