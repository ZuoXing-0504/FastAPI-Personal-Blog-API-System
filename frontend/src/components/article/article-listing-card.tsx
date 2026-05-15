import Link from "next/link";
import { Clock3 } from "lucide-react";

import { PublicArticle, getCategoryBySlug } from "@/content/discovery";

type ArticleListingCardProps = {
  article: PublicArticle;
};

export function ArticleListingCard({ article }: ArticleListingCardProps) {
  const category = getCategoryBySlug(article.category);

  return (
    <Link
      href={`/articles/${article.id}`}
      className="surface-card rounded-card flex h-full flex-col justify-between p-6 transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-xs tracking-[0.18em] text-black/50 uppercase">
          <span className="bg-accent-soft text-accent rounded-pill px-3 py-1 font-semibold">
            {category?.name ?? article.category}
          </span>
          <span>{article.publishedAt}</span>
        </div>
        <div className="space-y-3">
          <h3 className="editorial-title text-3xl leading-tight text-black">
            {article.title}
          </h3>
          <p className="editorial-copy text-base">{article.summary}</p>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4 border-t border-black/8 pt-4 text-sm text-black/58">
        <span>{article.author}</span>
        <span className="inline-flex items-center gap-2">
          <Clock3 className="size-4" />
          {article.readTime}
        </span>
      </div>
    </Link>
  );
}
