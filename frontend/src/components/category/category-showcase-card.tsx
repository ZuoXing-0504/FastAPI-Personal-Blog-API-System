import { ArrowUpRight } from "lucide-react";

import { CategoryShowcase } from "@/content/home";

export function CategoryShowcaseCard({
  name,
  description,
  articleCount,
}: CategoryShowcase) {
  return (
    <article className="surface-card rounded-card flex h-full flex-col justify-between p-6 transition-transform duration-200 hover:-translate-y-1">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h3 className="editorial-title text-2xl text-black">{name}</h3>
          <ArrowUpRight className="size-5 text-black/35" />
        </div>
        <p className="editorial-copy text-base">{description}</p>
      </div>
      <div className="mt-8 border-t border-black/8 pt-4 text-sm tracking-[0.16em] text-black/45 uppercase">
        {articleCount}
      </div>
    </article>
  );
}
