import {
  Archive,
  CalendarClock,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<
  string,
  { pill: string; Icon: typeof CheckCircle2 }
> = {
  published: {
    pill: "bg-admin-success-soft text-admin-success border-admin-success/25",
    Icon: CheckCircle2,
  },
  active: {
    pill: "bg-admin-success-soft text-admin-success border-admin-success/25",
    Icon: CheckCircle2,
  },
  true: {
    pill: "bg-admin-success-soft text-admin-success border-admin-success/25",
    Icon: CheckCircle2,
  },
  upcoming: {
    pill: "bg-admin-info-soft text-admin-info border-admin-info/25",
    Icon: CalendarClock,
  },
  draft: {
    pill: "bg-admin-amber-soft text-admin-amber border-admin-amber/25",
    Icon: Clock3,
  },
  cancelled: {
    pill: "bg-admin-danger-soft text-admin-danger border-admin-danger/25",
    Icon: XCircle,
  },
  inactive: {
    pill: "bg-admin-muted text-admin-sub border-admin-border",
    Icon: Archive,
  },
  past: {
    pill: "bg-admin-muted text-admin-sub border-admin-border",
    Icon: Archive,
  },
  false: {
    pill: "bg-admin-muted text-admin-sub border-admin-border",
    Icon: Archive,
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
  const config = STATUS_CONFIG[key] || STATUS_CONFIG.inactive;
  const Icon = config.Icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2.5 py-0.5 font-admin text-[12px] font-medium capitalize leading-[1.35]",
        config.pill,
        className
      )}
    >
      <Icon size={12} strokeWidth={2} aria-hidden="true" className="shrink-0" />
      {label}
    </span>
  );
}
