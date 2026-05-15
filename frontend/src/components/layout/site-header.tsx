"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Container } from "@/components/common/container";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/articles", label: "Articles" },
  { href: "/categories", label: "Categories" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();
  const accountHref = isAuthenticated ? "/studio" : "/login";
  const accountLabel = isAuthenticated ? "Studio" : "Login";

  return (
    <header className="bg-background/85 sticky top-0 z-40 border-b border-black/8 backdrop-blur-xl">
      <Container className="py-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/"
              className="flex min-w-0 items-center gap-3"
            >
              <span className="bg-accent text-background flex size-11 items-center justify-center rounded-2xl text-sm font-semibold tracking-[0.22em] uppercase shadow-[0_10px_30px_rgba(31,79,255,0.22)]">
                FP
              </span>
              <div className="min-w-0 space-y-0.5">
                <p className="editorial-title truncate text-lg text-black">
                  FastAPI Personal Blog
                </p>
                <p className="text-muted text-xs tracking-[0.18em] uppercase">
                  Editorial Tech
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              {isAuthenticated && user ? (
                <Link
                  href="/studio/profile"
                  className="text-muted hidden rounded-full border border-black/8 px-4 py-2 text-sm transition-colors hover:border-black/14 hover:text-black sm:inline-flex"
                >
                  {user.username}
                </Link>
              ) : (
                <Link
                  href="/register"
                  className="text-muted hidden rounded-full border border-black/8 px-4 py-2 text-sm transition-colors hover:border-black/14 hover:text-black sm:inline-flex"
                >
                  Register
                </Link>
              )}

              <Link
                href={accountHref}
                className="bg-accent text-background inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold shadow-[0_14px_34px_rgba(31,79,255,0.18)] transition-transform hover:-translate-y-0.5"
              >
                {accountLabel}
              </Link>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-2 text-sm">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3.5 py-2 transition-colors",
                  pathname === item.href
                    ? "bg-black text-white"
                    : "text-muted hover:bg-white/80 hover:text-black",
                )}
              >
                {item.label}
              </Link>
            ))}

            {!isAuthenticated ? (
              <Link
                href="/register"
                className="text-muted rounded-full px-3.5 py-2 transition-colors hover:bg-white/80 hover:text-black sm:hidden"
              >
                Register
              </Link>
            ) : null}
          </nav>
        </div>
      </Container>
    </header>
  );
}
