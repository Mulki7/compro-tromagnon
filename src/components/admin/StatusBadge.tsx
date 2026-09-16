import { cn } from "@/lib/utils";

const STYLES: Record<string, string> = {
  active: "bg-black text-white",
  inactive: "bg-neutral-200 text-neutral-600",
  published: "bg-black text-white",
  draft: "bg-neutral-200 text-neutral-600",
  upcoming: "bg-black text-white",
  past: "bg-neutral-200 text-neutral-600",
  cancelled: "bg-red-100 text-red-700",
  true: "bg-black text-white",
  false: "bg-neutral-200 text-neutral-600",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const key = String(status).toLowerCase();
  const label =
    key === "true" ? "Active" : key === "false" ? "Inactive" : status;

  return (
    <span
      className={cn(
        "inline-block px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider",
        STYLES[key] || "bg-neutral-100 text-neutral-700",
        className
      )}
    >
      {label}
    </span>
  );
}
