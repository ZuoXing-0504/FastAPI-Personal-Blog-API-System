import Link from "next/link";

import { cn } from "@/lib/utils";

type PaginationNavProps = {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
};

export function PaginationNav({
  currentPage,
  totalPages,
  buildHref,
}: PaginationNavProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-black/8 pt-6">
      <div className="text-sm text-black/52">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <Link
              key={page}
              href={buildHref(page)}
              className={cn(
                "rounded-pill inline-flex min-w-10 items-center justify-center border px-4 py-2 text-sm font-medium transition-colors",
                page === currentPage
                  ? "border-black bg-black text-white"
                  : "border-line bg-surface text-black/70 hover:bg-white hover:text-black",
              )}
            >
              {page}
            </Link>
          ),
        )}
      </div>
    </div>
  );
}
