import { ArrowRight, BookMarked, LayoutDashboard } from "lucide-react";

import { ArticlePreviewCard } from "@/components/article/article-preview-card";
import { Container } from "@/components/common/container";
import { CtaLink } from "@/components/common/cta-link";
import { SectionHeading } from "@/components/common/section-heading";
import { StatChip } from "@/components/common/stat-chip";
import { CategoryShowcaseCard } from "@/components/category/category-showcase-card";
import { ProjectHighlightCard } from "@/components/home/project-highlight-card";
import {
  featuredArticles,
  featuredCategories,
  projectHighlights,
  showcaseStats,
} from "@/content/home";

export default function Home() {
  return (
    <main className="overflow-hidden py-10 sm:py-14">
      <Container className="space-y-24">
        <section className="relative">
          <div className="surface-card rounded-panel relative grid gap-12 overflow-hidden p-8 md:grid-cols-[1.1fr_0.9fr] md:p-10 lg:p-12">
            <div className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top_left,_rgba(31,79,255,0.14),_transparent_48%),radial-gradient(circle_at_top_right,_rgba(21,107,82,0.10),_transparent_32%)]" />
            <div className="relative space-y-8">
              <SectionHeading
                eyebrow="Editorial Tech Blog"
                title="Build a portfolio blog that looks sharp and explains real engineering work."
                description="This front page is designed to feel more like a polished product narrative than a generic student dashboard. It frames the backend project as something worth reading, not just testing."
              />
              <div className="flex flex-wrap gap-3">
                <CtaLink href="/articles">
                  Start Reading
                  <ArrowRight className="size-4" />
                </CtaLink>
                <CtaLink href="/login" variant="secondary">
                  Open Studio
                  <LayoutDashboard className="size-4" />
                </CtaLink>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {showcaseStats.map((stat) => (
                  <StatChip
                    key={stat.label}
                    value={stat.value}
                    label={stat.label}
                  />
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-panel border-line-strong bg-surface-strong relative overflow-hidden border p-6 shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
                <div className="absolute -top-10 -right-10 size-32 rounded-full bg-[radial-gradient(circle,_rgba(31,79,255,0.22),_transparent_68%)]" />
                <div className="absolute -bottom-10 left-10 size-28 rounded-full bg-[radial-gradient(circle,_rgba(21,107,82,0.16),_transparent_68%)]" />
                <div className="relative space-y-6">
                  <div className="flex items-center justify-between gap-4">
                    <span className="editorial-eyebrow">This Week</span>
                    <span className="text-sm text-black/45">
                      Curated showcase
                    </span>
                  </div>

                  <article className="rounded-card bg-black px-6 py-7 text-white shadow-[0_16px_40px_rgba(20,20,20,0.16)]">
                    <div className="mb-4 flex items-center gap-2 text-sm tracking-[0.16em] text-white/60 uppercase">
                      <BookMarked className="size-4" />
                      Featured Write-up
                    </div>
                    <h3 className="text-3xl leading-tight font-semibold tracking-tight">
                      JWT auth, article permissions, migrations, and a frontend
                      shell that finally feels presentable.
                    </h3>
                  </article>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-card border border-black/10 bg-white p-5">
                      <div className="mb-2 text-sm tracking-[0.16em] text-black/45 uppercase">
                        Design direction
                      </div>
                      <p className="text-base leading-7 text-black/70">
                        Cream surfaces, graphite text, cobalt accents, and
                        purposeful spacing for a cleaner reading mood.
                      </p>
                    </div>
                    <div className="rounded-card border border-black/10 bg-white p-5">
                      <div className="mb-2 text-sm tracking-[0.16em] text-black/45 uppercase">
                        Project framing
                      </div>
                      <p className="text-base leading-7 text-black/70">
                        Show the backend as a product story, not just a list of
                        endpoints and CRUD screenshots.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <SectionHeading
            eyebrow="Latest Essays"
            title="Recent writing designed to make the backend feel alive."
            description="Until the API layer is wired into the homepage, these cards act as editorial placeholders for the real content structure."
          />
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <ArticlePreviewCard {...featuredArticles[0]} />
            <div className="grid gap-6">
              {featuredArticles.slice(1).map((article) => (
                <ArticlePreviewCard key={article.title} {...article} />
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <SectionHeading
            eyebrow="Browse by Category"
            title="Content clusters that match how people actually explore projects."
            description="Instead of pushing everything into one stream, categories give the homepage a cleaner rhythm and make the future list page easier to navigate."
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featuredCategories.map((category) => (
              <CategoryShowcaseCard key={category.name} {...category} />
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <SectionHeading
            eyebrow="Project Highlights"
            title="The homepage also explains why this blog system is worth showing."
            description="These blocks translate backend work into user-facing value, which is especially useful for portfolio and interview storytelling."
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {projectHighlights.map((highlight) => (
              <ProjectHighlightCard key={highlight.title} {...highlight} />
            ))}
          </div>
        </section>

        <section>
          <div className="rounded-panel border-line-strong relative overflow-hidden border bg-black px-8 py-10 text-white shadow-[0_30px_80px_rgba(20,20,20,0.16)] md:px-10 md:py-12">
            <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,_rgba(31,79,255,0.22),_transparent_58%)]" />
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl space-y-4">
                <span className="editorial-eyebrow border-white/15 text-white/60">
                  Next Step
                </span>
                <h2 className="editorial-title text-4xl text-white sm:text-5xl">
                  The homepage is ready. Next we connect real browsing flows.
                </h2>
                <p className="max-w-xl text-lg leading-8 text-white/72">
                  After this step, the natural follow-up is the article list and
                  category pages, where the visual language starts meeting real
                  information architecture.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <CtaLink
                  href="/categories"
                  variant="secondary"
                  className="border-white/18 bg-white/6 text-white hover:bg-white/10"
                >
                  View Categories
                </CtaLink>
                <CtaLink href="/articles">
                  Continue to Articles
                  <ArrowRight className="size-4" />
                </CtaLink>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
