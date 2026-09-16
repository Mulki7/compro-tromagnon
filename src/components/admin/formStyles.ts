export const inputClass =
  "w-full border border-neutral-200 bg-white px-3 py-2.5 text-sm font-mono focus:border-black focus:outline-none";

export const labelClass =
  "mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-wider text-neutral-600";

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 bg-black px-4 py-2.5 font-mono text-xs uppercase tracking-wide text-white transition hover:bg-neutral-800 disabled:opacity-50";

export const btnSecondary =
  "inline-flex items-center justify-center gap-2 border border-neutral-300 bg-white px-4 py-2.5 font-mono text-xs uppercase tracking-wide text-neutral-700 transition hover:border-black hover:text-black disabled:opacity-50";

export const btnDanger =
  "inline-flex items-center justify-center gap-2 border border-red-200 bg-white px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide text-red-600 transition hover:bg-red-50";

export const btnEdit =
  "inline-flex items-center justify-center gap-2 border border-neutral-200 bg-white px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide text-neutral-700 transition hover:border-black hover:text-black";

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
