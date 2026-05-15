import Link from "next/link";
import { Clock3 } from "lucide-react";

import { FeaturedArticle } from "@/content/home";
import { cn } from "@/lib/utils";

type ArticlePreviewCardProps = FeaturedArticle & {
  className?: string;
};

export function ArticlePreviewCard({
  id,
  title,
  summary,
  category,
  author,
  publishedAt,
  readTime,
  featured = false,
  className,
}: ArticlePreviewCardProps) {
  return (
    <Link
      href={`/articles/${id}`}
      className={cn(
        "surface-card group rounded-panel flex h-full flex-col justify-between p-6 transition-transform duration-200 hover:-translate-y-1",
        featured && "bg-surface-strong md:p-8",
        className,
      )}
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-3 text-xs tracking-[0.18em] text-black/55 uppercase">
          <span className="rounded-pill bg-accent-soft text-accent border border-transparent px-3 py-1 font-semibold">
            {category}
          </span>
          <span>{publishedAt}</span>
        </div>
        <div className="space-y-3">
          <h3
            className={cn(
              "editorial-title leading-tight text-black",
              featured ? "text-3xl sm:text-4xl" : "text-2xl",
            )}
          >
            {title}
          </h3>
          <p className="editorial-copy text-base">{summary}</p>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4 border-t border-black/8 pt-5 text-sm text-black/60">
        <span>{author}</span>
        <span className="inline-flex items-center gap-2">
          <Clock3 className="size-4" />
          {readTime}
        </span>
      </div>
    </Link>
  );
}
