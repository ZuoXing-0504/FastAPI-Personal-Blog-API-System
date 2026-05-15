import { Search } from "lucide-react";

import { ArticleListingCard } from "@/components/article/article-listing-card";
import { Container } from "@/components/common/container";
import { EmptyState } from "@/components/common/empty-state";
import { PaginationNav } from "@/components/common/pagination-nav";
import { SectionHeading } from "@/components/common/section-heading";
import { CategoryFilterLink } from "@/components/category/category-filter-link";
import {
  getCategoryBySlug,
  publicArticles,
  publicCategories,
} from "@/content/discovery";

const PAGE_SIZE = 4;

type ArticlesPageProps = {
  searchParams?: Promise<{
    category?: string;
    page?: string;
  }>;
};

function buildArticlesHref(category: string | null, page: number) {
  const search = new URLSearchParams();

  if (category) {
    search.set("category", category);
  }

  if (page > 1) {
    search.set("page", String(page));
  }

  const query = search.toString();
  return query ? `/articles?${query}` : "/articles";
}

export default async function ArticlesPage({
  searchParams,
}: ArticlesPageProps) {
  const params = (await searchParams) ?? {};
  const activeCategorySlug = params.category ?? null;
  const activeCategory = activeCategorySlug
    ? getCategoryBySlug(activeCategorySlug)
    : null;

  const requestedPage = Number(params.page ?? "1");
  const currentPage =
    Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const filteredArticles = activeCategorySlug
    ? publicArticles.filter(
        (article) => article.category === activeCategorySlug,
      )
    : publicArticles;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredArticles.length / PAGE_SIZE),
  );
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const currentItems = filteredArticles.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  return (
    <main className="py-12 sm:py-16">
      <Container className="space-y-10">
        <section className="surface-card rounded-panel p-8 md:p-10">
          <SectionHeading
            eyebrow="Article Index"
            title="A clean browsing layer for technical writing and project storytelling."
            description="This page is already structured like a real content surface: category filtering, paged rhythm, and card-based reading flow. The API wiring will come next."
          />
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <div className="text-sm tracking-[0.16em] text-black/45 uppercase">
                Filter by category
              </div>
              <div className="flex flex-wrap gap-2">
                <CategoryFilterLink
                  href="/articles"
                  label="All"
                  active={!activeCategorySlug}
                />
                {publicCategories.map((category) => (
                  <CategoryFilterLink
                    key={category.slug}
                    href={buildArticlesHref(category.slug, 1)}
                    label={category.name}
                    active={activeCategorySlug === category.slug}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-pill border-line bg-surface inline-flex items-center gap-3 border px-4 py-3 text-sm text-black/55">
              <Search className="size-4" />
              API-driven search arrives in step 8
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-black/55">
            <div>
              Showing {currentItems.length} of {filteredArticles.length}{" "}
              articles
              {activeCategory ? ` in ${activeCategory.name}` : ""}
            </div>
            <div>Page {safePage}</div>
          </div>

          {currentItems.length ? (
            <div className="grid gap-6 xl:grid-cols-2">
              {currentItems.map((article) => (
                <ArticleListingCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No articles matched this category yet."
              description="The filtering structure is already here. Once the API layer is connected, empty results, search, and pagination states will all be driven by real backend data."
            />
          )}

          <PaginationNav
            currentPage={safePage}
            totalPages={totalPages}
            buildHref={(page) => buildArticlesHref(activeCategorySlug, page)}
          />
        </section>
      </Container>
    </main>
  );
}
