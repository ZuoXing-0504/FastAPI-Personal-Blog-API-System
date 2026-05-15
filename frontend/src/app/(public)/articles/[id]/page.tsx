import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock3, Eye, FolderKanban } from "lucide-react";
import { notFound } from "next/navigation";

import { ArticleListingCard } from "@/components/article/article-listing-card";
import { ReadingProgress } from "@/components/article/reading-progress";
import { Container } from "@/components/common/container";
import { CtaLink } from "@/components/common/cta-link";
import {
  getArticleById,
  getCategoryBySlug,
  getRelatedArticles,
} from "@/content/discovery";

type ArticleDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return Array.from({ length: 10 }, (_, index) => ({
    id: String(index + 1),
  }));
}

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  const resolvedParams = await params;
  const articleId = Number(resolvedParams.id);

  if (!Number.isInteger(articleId)) {
    notFound();
  }

  const article = getArticleById(articleId);

  if (!article) {
    notFound();
  }

  const category = getCategoryBySlug(article.category);
  const relatedArticles = getRelatedArticles(article);

  return (
    <main className="py-12 sm:py-16">
      <ReadingProgress />
      <Container className="space-y-10">
        <div className="flex justify-start">
          <Link
            href="/articles"
            className="text-muted inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-black"
          >
            <ArrowLeft className="size-4" />
            Back to articles
          </Link>
        </div>

        <section className="surface-card rounded-panel overflow-hidden p-8 md:p-10">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-8">
              <div className="flex flex-wrap items-center gap-3 text-xs tracking-[0.18em] text-black/48 uppercase">
                <span className="bg-accent-soft text-accent rounded-pill px-3 py-1 font-semibold">
                  {category?.name ?? article.category}
                </span>
                <span>{article.publishedAt}</span>
              </div>

              <div className="space-y-5">
                <h1 className="editorial-title max-w-4xl text-4xl leading-tight text-black sm:text-5xl">
                  {article.title}
                </h1>
                <p className="max-w-3xl text-lg leading-8 text-black/64">
                  {article.summary}
                </p>
              </div>

              <div className="grid gap-3 text-sm text-black/62 sm:grid-cols-3">
                <div className="rounded-card border border-black/8 bg-white p-4">
                  <div className="mb-2 text-xs tracking-[0.16em] text-black/40 uppercase">
                    Author
                  </div>
                  <div className="text-black">{article.author}</div>
                </div>
                <div className="rounded-card border border-black/8 bg-white p-4">
                  <div className="mb-2 text-xs tracking-[0.16em] text-black/40 uppercase">
                    Read time
                  </div>
                  <div className="inline-flex items-center gap-2 text-black">
                    <Clock3 className="size-4" />
                    {article.readTime}
                  </div>
                </div>
                <div className="rounded-card border border-black/8 bg-white p-4">
                  <div className="mb-2 text-xs tracking-[0.16em] text-black/40 uppercase">
                    Views
                  </div>
                  <div className="inline-flex items-center gap-2 text-black">
                    <Eye className="size-4" />
                    {article.viewCount}
                  </div>
                </div>
              </div>
            </div>

            <aside className="space-y-5">
              <div className="rounded-panel bg-black p-6 text-white shadow-[0_28px_72px_rgba(20,20,20,0.14)]">
                <div className="mb-4 text-sm tracking-[0.16em] text-white/55 uppercase">
                  Reading notes
                </div>
                <ul className="space-y-3 text-base leading-7 text-white/78">
                  {article.takeaways.map((takeaway) => (
                    <li key={takeaway} className="flex gap-3">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-white/70" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-panel border border-black/8 bg-white p-6">
                <div className="mb-4 text-sm tracking-[0.16em] text-black/42 uppercase">
                  Continue exploring
                </div>
                <div className="space-y-3">
                  <CtaLink
                    href="/articles"
                    variant="secondary"
                    className="w-full justify-between"
                  >
                    Browse more articles
                    <ArrowRight className="size-4" />
                  </CtaLink>
                  <CtaLink
                    href={`/articles?category=${article.category}`}
                    variant="secondary"
                    className="w-full justify-between"
                  >
                    More in {category?.name ?? article.category}
                    <FolderKanban className="size-4" />
                  </CtaLink>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <article className="rounded-panel border border-black/8 bg-white px-6 py-8 sm:px-8 sm:py-10">
            <div className="space-y-8">
              {article.body.map((paragraph, index) => (
                <p
                  key={`${article.id}-${index}`}
                  className="text-lg leading-9 text-black/78"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </article>

          <aside className="space-y-4">
            <div className="rounded-panel border border-black/8 bg-white p-6">
              <div className="mb-4 text-sm tracking-[0.16em] text-black/42 uppercase">
                Article context
              </div>
              <div className="space-y-4 text-sm leading-7 text-black/62">
                <p>
                  This detail page focuses on reading hierarchy first: metadata,
                  strong title contrast, generous spacing, and a clean content
                  rhythm for longer technical writing.
                </p>
                <p>
                  In a later step, the same layout will be connected to real API
                  responses and view count updates from the backend.
                </p>
              </div>
            </div>
          </aside>
        </section>

        <section className="space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-sm tracking-[0.16em] text-black/45 uppercase">
                Related Reading
              </div>
              <h2 className="editorial-title mt-2 text-3xl text-black">
                More from the same category
              </h2>
            </div>
          </div>

          {relatedArticles.length ? (
            <div className="grid gap-6 xl:grid-cols-2">
              {relatedArticles.map((relatedArticle) => (
                <ArticleListingCard
                  key={relatedArticle.id}
                  article={relatedArticle}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-panel border border-black/8 bg-white p-6 text-black/60">
              More related articles will appear here once the content library
              grows.
            </div>
          )}
        </section>
      </Container>
    </main>
  );
}
