"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FilePenLine,
  Filter,
  LoaderCircle,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/common/empty-state";
import { SkeletonBlock } from "@/components/common/skeleton-block";
import { useAuth } from "@/hooks/use-auth";
import { deleteArticle, listArticles } from "@/lib/api/articles";
import { ApiError } from "@/lib/api/client";
import { listCategories } from "@/lib/api/categories";
import { cn, formatDateLabel } from "@/lib/utils";

const PAGE_SIZE = 6;

export function MyArticlesPanel() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const deferredKeyword = useDeferredValue(keyword);

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: listCategories,
  });

  const articlesQuery = useQuery({
    queryKey: ["articles", "all"],
    queryFn: () =>
      listArticles({
        page: 1,
        pageSize: 100,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      toast.success("文章已删除。");
      queryClient.invalidateQueries({
        queryKey: ["articles", "all"],
      });
    },
    onError: (error) => {
      const message =
        error instanceof ApiError
          ? error.message
          : "删除文章失败，请稍后再试。";
      toast.error(message);
    },
  });

  if (!user) {
    return null;
  }

  const allArticles = articlesQuery.data?.items ?? [];
  const ownArticles = allArticles.filter((article) => article.author.id === user.id);
  const filteredArticles = ownArticles.filter((article) => {
    const matchesKeyword =
      !deferredKeyword.trim() ||
      article.title.toLowerCase().includes(deferredKeyword.trim().toLowerCase()) ||
      (article.summary || "")
        .toLowerCase()
        .includes(deferredKeyword.trim().toLowerCase());
    const matchesCategory =
      selectedCategoryId === null || article.category.id === selectedCategoryId;

    return matchesKeyword && matchesCategory;
  });

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  async function handleDelete(articleId: number) {
    if (!window.confirm("确认删除这篇文章吗？删除后将无法恢复。")) {
      return;
    }

    await deleteMutation.mutateAsync(articleId);
  }

  return (
    <div className="space-y-6">
      <section className="surface-card rounded-[2rem] px-6 py-7 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <span className="editorial-eyebrow">Article operations</span>
            <div className="space-y-3">
              <h2 className="editorial-title text-4xl text-black sm:text-5xl">
                Manage your articles in one place.
              </h2>
              <p className="editorial-copy text-base sm:text-lg">
                This page focuses on your own posts, with local filtering,
                editing, and deletion wired to the real FastAPI article APIs.
              </p>
            </div>
          </div>

          <Link
            href="/studio/articles/new"
            className="bg-accent text-background inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold shadow-[0_18px_40px_rgba(31,79,255,0.18)] transition-transform hover:-translate-y-0.5"
          >
            <Plus className="size-4" />
            New article
          </Link>
        </div>
      </section>

      <section className="surface-card rounded-[2rem] px-6 py-6 sm:px-8">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-black">Search</span>
            <span className="flex items-center gap-3 rounded-[1.3rem] border border-black/10 bg-white/80 px-4 py-3">
              <Search className="text-muted size-4" />
              <input
                value={keyword}
                onChange={(event) => {
                  setKeyword(event.target.value);
                  setPage(1);
                }}
                placeholder="Search by title or summary"
                className="w-full bg-transparent text-sm text-black outline-none placeholder:text-black/28"
              />
            </span>
          </label>

          <label className="space-y-2">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-black">
              <Filter className="size-4" />
              Category
            </span>
            <select
              value={selectedCategoryId ?? ""}
              onChange={(event) => {
                setSelectedCategoryId(
                  event.target.value ? Number(event.target.value) : null,
                );
                setPage(1);
              }}
              className="w-full rounded-[1.3rem] border border-black/10 bg-white/80 px-4 py-3 text-sm text-black outline-none"
            >
              <option value="">All categories</option>
              {(categoriesQuery.data ?? []).map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {articlesQuery.isLoading ? (
        <div className="grid gap-5 xl:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="surface-card rounded-[1.75rem] p-6">
              <SkeletonBlock className="h-5 w-32" />
              <SkeletonBlock className="mt-5 h-9 w-3/4" />
              <SkeletonBlock className="mt-3 h-20 w-full" />
              <SkeletonBlock className="mt-6 h-10 w-48" />
            </div>
          ))}
        </div>
      ) : articlesQuery.isError ? (
        <EmptyState
          title="Failed to load articles"
          description="The article list could not be loaded. Please confirm the FastAPI backend is running and try again."
          icon={<LoaderCircle className="size-5" />}
        />
      ) : filteredArticles.length === 0 ? (
        <EmptyState
          title="No matching articles yet"
          description="Create your first article or relax the current filters to see more results."
          icon={<FilePenLine className="size-5" />}
          action={
            <Link
              href="/studio/articles/new"
              className="bg-black text-white inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium"
            >
              <Plus className="size-4" />
              Write an article
            </Link>
          }
        />
      ) : (
        <>
          <section className="grid gap-5 xl:grid-cols-2">
            {paginatedArticles.map((article) => (
              <article
                key={article.id}
                className="surface-card flex h-full flex-col rounded-[1.75rem] p-6"
              >
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold tracking-[0.16em] uppercase">
                  <span className="text-accent rounded-full bg-blue-50 px-3 py-1">
                    {article.category.name}
                  </span>
                  <span className="text-muted">
                    {formatDateLabel(article.created_at)}
                  </span>
                </div>

                <div className="mt-5 flex-1 space-y-3">
                  <h3 className="editorial-title text-2xl text-black">
                    {article.title}
                  </h3>
                  <p className="editorial-copy text-sm">
                    {article.summary || "No summary yet. This article goes straight into the full content body."}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={`/studio/articles/${article.id}/edit`}
                    className="bg-black text-white inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium"
                  >
                    <FilePenLine className="size-4" />
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(article.id)}
                    disabled={deleteMutation.isPending}
                    className={cn(
                      "text-muted inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2.5 text-sm font-medium transition-colors hover:border-red-300 hover:text-red-700",
                      deleteMutation.isPending && "cursor-not-allowed opacity-70",
                    )}
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </button>
                  <Link
                    href={`/articles/${article.id}`}
                    className="text-muted inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2.5 text-sm font-medium transition-colors hover:border-black/18 hover:text-black"
                  >
                    View public page
                  </Link>
                </div>
              </article>
            ))}
          </section>

          <section className="surface-card rounded-[1.75rem] px-6 py-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="editorial-copy text-sm">
                Showing {paginatedArticles.length} of {filteredArticles.length}{" "}
                articles owned by you.
              </p>
              {totalPages > 1 ? (
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                    (pageNumber) => (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() => setPage(pageNumber)}
                        className={cn(
                          "inline-flex min-w-10 items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                          pageNumber === currentPage
                            ? "border-black bg-black text-white"
                            : "border-black/10 bg-white/80 text-black/70 hover:bg-white hover:text-black",
                        )}
                      >
                        {pageNumber}
                      </button>
                    ),
                  )}
                </div>
              ) : null}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
