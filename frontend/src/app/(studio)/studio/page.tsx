import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Workflow } from "lucide-react";

const dashboardCards = [
  {
    title: "Session is live",
    description:
      "The frontend now keeps your token pair in persisted state and can rotate the access token through the refresh endpoint.",
    icon: ShieldCheck,
  },
  {
    title: "Studio scaffold is ready",
    description:
      "This dashboard, sidebar, and top bar establish the protected route structure for the author workspace.",
    icon: Workflow,
  },
  {
    title: "Next steps are focused",
    description:
      "Article CRUD, category management, and profile details will land on top of this shell in the next milestones.",
    icon: Sparkles,
  },
];

export default function StudioDashboardPage() {
  return (
    <div className="space-y-6">
      <section className="surface-card rounded-[2rem] px-6 py-7 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <span className="editorial-eyebrow">Dashboard</span>
            <div className="space-y-3">
              <h2 className="editorial-title text-4xl text-black sm:text-5xl">
                The protected author area is officially online.
              </h2>
              <p className="editorial-copy text-base sm:text-lg">
                You can now move from public pages into a gated writing studio.
                The next build phases will attach real article and category
                management screens to this shell.
              </p>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-black/8 bg-white/75 px-5 py-4">
            <p className="text-muted text-xs font-semibold tracking-[0.2em] uppercase">
              Current status
            </p>
            <p className="editorial-title mt-2 text-2xl text-black">
              Step 9 ready
            </p>
            <p className="editorial-copy mt-2 text-sm">
              Login redirects here and unauthenticated visits bounce back to the
              auth flow.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        {dashboardCards.map(({ title, description, icon: Icon }) => (
          <article key={title} className="surface-card rounded-[1.75rem] p-6">
            <div className="bg-accent-soft text-accent mb-4 inline-flex size-11 items-center justify-center rounded-2xl">
              <Icon className="size-5" />
            </div>
            <h3 className="editorial-title text-2xl text-black">{title}</h3>
            <p className="editorial-copy mt-3 text-sm">{description}</p>
          </article>
        ))}
      </section>

      <section className="surface-card rounded-[2rem] px-6 py-6 sm:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <h3 className="editorial-title text-2xl text-black">
              Continue into content operations
            </h3>
            <p className="editorial-copy text-sm sm:text-base">
              The next milestone will turn the placeholder sections into real
              article creation, editing, and category workflows.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/studio/articles"
              className="bg-black text-white inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium"
            >
              Open articles
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/studio/categories"
              className="text-muted inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2.5 text-sm font-medium transition-colors hover:border-black/18 hover:text-black"
            >
              Open categories
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
