import Link from "next/link";
import { PropsWithChildren } from "react";
import { ArrowLeft, BookOpenText, RefreshCcw, ShieldCheck } from "lucide-react";

import { Container } from "@/components/common/container";

const authHighlights = [
  {
    title: "JWT secured",
    description: "Access tokens gate every write action in the blog workspace.",
    icon: ShieldCheck,
  },
  {
    title: "Refresh rotation",
    description: "Sessions recover gracefully with refresh-token rotation.",
    icon: RefreshCcw,
  },
  {
    title: "Author workflow",
    description: "Publish, edit, and manage categories from one writing studio.",
    icon: BookOpenText,
  },
];

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="from-background via-background to-accent-soft/35 relative min-h-screen overflow-hidden bg-gradient-to-b">
      <div className="bg-accent/10 pointer-events-none absolute top-20 left-[-7rem] h-72 w-72 rounded-full blur-3xl" />
      <div className="bg-success/8 pointer-events-none absolute right-[-5rem] bottom-8 h-80 w-80 rounded-full blur-3xl" />

      <Container className="relative flex min-h-screen flex-col py-6 sm:py-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="text-muted inline-flex items-center gap-2 text-sm transition-colors hover:text-black"
          >
            <ArrowLeft className="size-4" />
            Back to homepage
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/articles"
              className="text-muted rounded-full border border-black/8 px-4 py-2 text-sm transition-colors hover:border-black/14 hover:text-black"
            >
              Browse articles
            </Link>
            <Link
              href="/register"
              className="bg-accent text-background rounded-full px-4 py-2 text-sm font-semibold shadow-[0_14px_34px_rgba(31,79,255,0.18)] transition-transform hover:-translate-y-0.5"
            >
              Start writing
            </Link>
          </div>
        </header>

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:py-14">
          <section className="space-y-8">
            <div className="space-y-5">
              <span className="editorial-eyebrow">
                Author Access
              </span>
              <div className="space-y-4">
                <h1 className="editorial-title max-w-3xl text-5xl text-black sm:text-6xl">
                  Turn a polished FastAPI backend into a blog publishing
                  workspace.
                </h1>
                <p className="editorial-copy max-w-2xl text-lg">
                  Sign in to create categories, publish articles, and show the
                  full end-to-end story of this internship-ready project. The
                  visual layer stays editorial, while the backend keeps strict
                  JWT permissions and refresh-token rotation.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {authHighlights.map(({ title, description, icon: Icon }) => (
                <div
                  key={title}
                  className="surface-card rounded-[1.75rem] p-5 transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="bg-accent-soft text-accent mb-4 inline-flex size-11 items-center justify-center rounded-2xl">
                    <Icon className="size-5" />
                  </div>
                  <h2 className="editorial-title text-xl text-black">{title}</h2>
                  <p className="editorial-copy mt-3 text-sm">{description}</p>
                </div>
              ))}
            </div>

            <div className="surface-card rounded-[2rem] p-6 sm:p-7">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-3">
                  <p className="text-muted text-xs font-semibold tracking-[0.22em] uppercase">
                    What unlocks after login
                  </p>
                  <ul className="space-y-3 text-sm text-black/80">
                    <li>Post and edit your own articles with author-only control.</li>
                    <li>Create fresh categories before publishing a new piece.</li>
                    <li>Validate the full auth flow for demos, interviews, and docs.</li>
                  </ul>
                </div>

                <div className="rounded-[1.5rem] border border-black/8 bg-white/70 px-5 py-4 text-right">
                  <p className="text-muted text-xs font-semibold tracking-[0.2em] uppercase">
                    Live stack
                  </p>
                  <p className="editorial-title mt-2 text-2xl text-black">
                    Next.js + FastAPI
                  </p>
                  <p className="editorial-copy mt-2 text-sm">
                    Frontend on `3000`, API on `8000`, one Docker command to
                    boot everything.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>{children}</section>
        </div>
      </Container>
    </div>
  );
}
