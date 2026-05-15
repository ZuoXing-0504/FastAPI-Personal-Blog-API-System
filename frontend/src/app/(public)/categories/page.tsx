import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/common/container";
import { SectionHeading } from "@/components/common/section-heading";
import { CategoryShowcaseCard } from "@/components/category/category-showcase-card";
import { publicCategories } from "@/content/discovery";

export default function CategoriesPage() {
  return (
    <main className="py-12 sm:py-16">
      <Container className="space-y-10">
        <section className="surface-card rounded-panel p-8 md:p-10">
          <SectionHeading
            eyebrow="Categories"
            title="Explore the project through themes instead of a flat timeline."
            description="This page gives the content system a stronger shape. It helps readers jump into the part of the project they care about most, whether that is backend engineering, learning notes, or portfolio framing."
          />
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {publicCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/articles?category=${category.slug}`}
              className="block"
            >
              <CategoryShowcaseCard
                name={category.name}
                description={category.description}
                articleCount={`${category.articleCount} preview articles`}
              />
            </Link>
          ))}
        </section>

        <section className="surface-card rounded-panel flex flex-col gap-6 p-8 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <div className="text-sm tracking-[0.16em] text-black/45 uppercase">
              Next flow
            </div>
            <h2 className="editorial-title text-3xl text-black sm:text-4xl">
              Category browsing is ready. Article detail comes next.
            </h2>
            <p className="editorial-copy max-w-2xl text-base">
              The next page in sequence is the article detail view, where we can
              bring together typography, metadata, reading hierarchy, and the
              eventual backend-powered content payload.
            </p>
          </div>

          <Link
            href="/articles"
            className="bg-accent text-background rounded-pill inline-flex items-center gap-2 px-5 py-3 text-sm font-medium shadow-[0_16px_36px_rgba(31,79,255,0.24)] transition-colors hover:bg-[#1334b4]"
          >
            Browse all articles
            <ArrowRight className="size-4" />
          </Link>
        </section>
      </Container>
    </main>
  );
}
