import { cn } from "@/lib/utils";

const STYLE_MAP: Record<string, { pill: string; dot: string }> = {
  published: {
    pill: "bg-admin-lime-soft text-admin-forest",
    dot: "bg-admin-forest",
  },
  active: {
    pill: "bg-admin-lime-soft text-admin-forest",
    dot: "bg-admin-forest",
  },
  true: {
    pill: "bg-admin-lime-soft text-admin-forest",
    dot: "bg-admin-forest",
  },
  upcoming: {
    pill: "bg-admin-info-soft text-admin-info",
    dot: "bg-admin-info",
  },
  draft: {
    pill: "bg-admin-amber-soft text-admin-amber",
    dot: "bg-admin-amber",
  },
  cancelled: {
    pill: "bg-admin-danger-soft text-admin-danger",
    dot: "bg-admin-danger",
  },
  inactive: {
    pill: "bg-admin-muted text-admin-sub",
    dot: "bg-admin-sub/60",
  },
  past: {
    pill: "bg-admin-muted text-admin-sub",
    dot: "bg-admin-sub/60",
  },
  false: {
    pill: "bg-admin-muted text-admin-sub",
    dot: "bg-admin-sub/60",
  },
};

interface StatusBadgeProps {
  status: string;
  labelOverride?: string;
  className?: string;
}

export default function StatusBadge({
  status,
  labelOverride,
  className,
}: StatusBadgeProps) {
  const key = String(status).toLowerCase();
  const label =
    labelOverride ||
    (key === "true" ? "Active" : key === "false" ? "Hidden" : status);
  const style = STYLE_MAP[key] || STYLE_MAP.inactive;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-[12px] font-semibold capitalize",
        style.pill,
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn("h-1.5 w-1.5 shrink-0 rounded-full", style.dot)}
      />
      {label}
    </span>
  );
}
