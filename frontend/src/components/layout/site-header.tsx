import Link from "next/link";

import { Container } from "@/components/common/container";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/articles", label: "Articles" },
  { href: "/categories", label: "Categories" },
  { href: "/login", label: "Login" },
];

export function SiteHeader() {
  return (
    <header className="bg-background/85 sticky top-0 z-40 border-b border-black/8 backdrop-blur-xl">
      <Container className="flex h-18 items-center justify-between gap-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="bg-accent text-background flex size-11 items-center justify-center rounded-2xl text-sm font-semibold tracking-[0.22em] uppercase shadow-[0_10px_30px_rgba(31,79,255,0.22)]">
            FP
          </span>
          <div className="space-y-0.5">
            <p className="editorial-title text-lg text-black">
              FastAPI Personal Blog
            </p>
            <p className="text-muted text-xs tracking-[0.18em] uppercase">
              Editorial Tech
            </p>
          </div>
        </Link>

        <nav className="text-muted hidden items-center gap-6 text-sm md:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-black"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
