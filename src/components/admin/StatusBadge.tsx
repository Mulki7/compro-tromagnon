import { cn } from "@/lib/utils";

const DOT: Record<string, string> = {
  active: "bg-satelit-accent",
  published: "bg-satelit-accent",
  upcoming: "bg-satelit-accent",
  true: "bg-satelit-accent",
  inactive: "bg-satelit-muted/50",
  draft: "bg-satelit-muted/50",
  past: "bg-satelit-muted/50",
  false: "bg-satelit-muted/50",
  cancelled: "bg-satelit-danger",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const key = String(status).toLowerCase();
  const label = key === "true" ? "Active" : key === "false" ? "Inactive" : status;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-[14px] font-medium capitalize text-satelit-ink",
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn("h-2 w-2 rounded-full", DOT[key] || "bg-satelit-muted/50")}
      />
      {label}
    </span>
  );
}
