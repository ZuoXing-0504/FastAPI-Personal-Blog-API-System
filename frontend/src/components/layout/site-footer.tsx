import Link from "next/link";

import { Container } from "@/components/common/container";

export function SiteFooter() {
  return (
    <footer className="border-line bg-background/80 border-t backdrop-blur">
      <Container className="flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="editorial-title text-lg text-black">
            FastAPI Personal Blog
          </p>
          <p className="editorial-copy text-sm">
            Built for backend practice, project showcase, and internship demos.
          </p>
        </div>
        <div className="text-muted flex flex-wrap gap-4 text-sm">
          <Link href="/">Home</Link>
          <Link href="/articles">Articles</Link>
          <Link href="/categories">Categories</Link>
          <Link href="/login">Login</Link>
        </div>
      </Container>
    </footer>
  );
}
