import Link from "next/link";

import { cn } from "@/lib/utils";

type CategoryFilterLinkProps = {
  href: string;
  label: string;
  active?: boolean;
};

export function CategoryFilterLink({
  href,
  label,
  active = false,
}: CategoryFilterLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-pill inline-flex items-center border px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "border-black bg-black text-white"
          : "border-line bg-surface text-black/70 hover:bg-white hover:text-black",
      )}
    >
      {label}
    </Link>
  );
}
