import Link from "next/link";
import { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

type CtaLinkProps = PropsWithChildren<{
  href: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}>;

export function CtaLink({
  href,
  variant = "primary",
  className,
  children,
}: CtaLinkProps) {
  const variants = {
    primary:
      "bg-accent text-white shadow-[0_16px_36px_rgba(31,79,255,0.24)] hover:bg-accent-strong",
    secondary: "border border-line-strong bg-surface text-black hover:bg-white",
    ghost: "text-muted hover:text-black",
  };

  return (
    <Link
      href={href}
      className={cn(
        "rounded-pill inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium transition-all duration-200",
        variants[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}
