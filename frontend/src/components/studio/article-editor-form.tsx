"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, LoaderCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/common/empty-state";
import { SkeletonBlock } from "@/components/common/skeleton-block";
import { useAuth } from "@/hooks/use-auth";
import {
  createArticle,
  getArticle,
  updateArticle,
} from "@/lib/api/articles";
import { ApiError } from "@/lib/api/client";
import { listCategories } from "@/lib/api/categories";
import type { ArticleCreateRequest, ArticleUpdateRequest } from "@/types/article";

type ArticleEditorFormProps = {
  mode: "create" | "edit";
  articleId?: number;
};

type ArticleFormValues = {
  title: string;
  summary: string;
  content: string;
  categoryId: string;
};

type ArticleFormErrors = Partial<Record<keyof ArticleFormValues, string>>;

const initialValues: ArticleFormValues = {
  title: "",
  summary: "",
  content: "",
  categoryId: "",
};

function validateArticle(values: ArticleFormValues) {
  const errors: ArticleFormErrors = {};

  if (!values.title.trim()) {
    errors.title = "请输入文章标题。";
  }

  if (values.title.trim().length > 200) {
    errors.title = "标题长度不能超过 200 个字符。";
  }

  if (values.summary.trim().length > 500) {
    errors.summary = "摘要长度不能超过 500 个字符。";
  }

  if (!values.categoryId) {
    errors.categoryId = "请选择文章分类。";
  }

  if (!values.content.trim()) {
    errors.content = "请输入正文内容。";
  }

  return errors;
}

export function ArticleEditorForm({
  mode,
  articleId,
}: ArticleEditorFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [draftValues, setDraftValues] = useState<ArticleFormValues | null>(
    mode === "create" ? initialValues : null,
  );
  const [errors, setErrors] = useState<ArticleFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: listCategories,
  });

  const articleQuery = useQuery({
    queryKey: ["article", articleId],
    queryFn: () => getArticle(articleId as number, false),
    enabled: mode === "edit" && Boolean(articleId),
  });

  const hydratedValues =
    mode === "edit" && articleQuery.data
      ? {
          title: articleQuery.data.title,
          summary: articleQuery.data.summary || "",
          content: articleQuery.data.content,
          categoryId: String(articleQuery.data.category.id),
        }
      : initialValues;

  const currentValues = draftValues ?? hydratedValues;

  const mutation = useMutation({
    mutationFn: async () => {
      const payload: ArticleCreateRequest = {
        title: currentValues.title.trim(),
        summary: currentValues.summary.trim() || null,
        content: currentValues.content.trim(),
        category_id: Number(currentValues.categoryId),
      };

      if (mode === "create") {
        return createArticle(payload);
      }

      const updatePayload: ArticleUpdateRequest = payload;
      return updateArticle(articleId as number, updatePayload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["articles", "all"],
      });

      if (articleId) {
        queryClient.invalidateQueries({
          queryKey: ["article", articleId],
        });
      }

      toast.success(mode === "create" ? "文章发布成功。" : "文章更新成功。");
      router.push("/studio/articles");
      router.refresh();
    },
    onError: (error) => {
      const message =
        error instanceof ApiError ? error.message : "保存文章失败，请稍后再试。";
      setSubmitError(message);
      toast.error(message);
    },
  });

  if (categoriesQuery.isLoading || (mode === "edit" && articleQuery.isLoading)) {
    return (
      <div className="space-y-6">
        <SkeletonBlock className="h-16 w-full rounded-[2rem]" />
        <SkeletonBlock className="h-96 w-full rounded-[2rem]" />
      </div>
    );
  }

  if (categoriesQuery.isError) {
    return (
      <EmptyState
        title="Failed to load categories"
        description="The editor could not load the category list. Please check the FastAPI service and try again."
        icon={<LoaderCircle className="size-5" />}
      />
    );
  }

  if (mode === "edit" && articleQuery.isError) {
    return (
      <EmptyState
        title="Failed to load article"
        description="The article detail request failed before the editor could initialize."
        icon={<LoaderCircle className="size-5" />}
      />
    );
  }

  if (
    mode === "edit" &&
    articleQuery.data &&
    user &&
    articleQuery.data.author.id !== user.id
  ) {
    return (
      <EmptyState
        title="No permission to edit this article"
        description="This article belongs to another author, so the protected studio blocks editing here before the backend even receives an update request."
        icon={<Sparkles className="size-5" />}
        action={
          <Link
            href="/studio/articles"
            className="bg-black text-white inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium"
          >
            <ArrowLeft className="size-4" />
            Back to my articles
          </Link>
        }
      />
    );
  }

  const categories = categoriesQuery.data ?? [];

  function updateField(
    field: keyof ArticleFormValues,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    setDraftValues({
      ...currentValues,
      [field]: event.target.value,
    });

    if (errors[field]) {
      setErrors((current) => ({
        ...current,
        [field]: undefined,
      }));
    }

    if (submitError) {
      setSubmitError(null);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateArticle(currentValues);
    setErrors(nextErrors);
    setSubmitError(null);

    if (Object.keys(nextErrors).length > 0) {
      toast.error("请先修正表单校验错误。");
      return;
    }

    await mutation.mutateAsync();
  }

  return (
    <div className="space-y-6">
      <section className="surface-card rounded-[2rem] px-6 py-7 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <span className="editorial-eyebrow">
              {mode === "create" ? "Publish article" : "Edit article"}
            </span>
            <div className="space-y-3">
              <h2 className="editorial-title text-4xl text-black sm:text-5xl">
                {mode === "create"
                  ? "Write a new backend story."
                  : "Refine your article before publishing the update."}
              </h2>
              <p className="editorial-copy max-w-3xl text-base sm:text-lg">
                The form uses the real FastAPI article endpoints, category
                binding, and author-only protection.
              </p>
            </div>
          </div>

          <Link
            href="/studio/articles"
            className="text-muted inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2.5 text-sm font-medium transition-colors hover:border-black/18 hover:text-black"
          >
            <ArrowLeft className="size-4" />
            Back to articles
          </Link>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="surface-card rounded-[2rem] px-6 py-6 sm:px-8">
          <div className="space-y-6">
            <label className="space-y-2.5">
              <span className="text-sm font-semibold text-black">Title</span>
              <input
                value={currentValues.title}
                onChange={(event) => updateField("title", event)}
                placeholder="例如：如何把 FastAPI 项目做得更像正式后端工程"
                className="w-full rounded-[1.35rem] border border-black/10 bg-white/85 px-4 py-3.5 text-sm text-black outline-none"
              />
              {errors.title ? (
                <span className="text-danger text-sm">{errors.title}</span>
              ) : null}
            </label>

            <label className="space-y-2.5">
              <span className="text-sm font-semibold text-black">Summary</span>
              <textarea
                value={currentValues.summary}
                onChange={(event) => updateField("summary", event)}
                placeholder="用 1-2 句话概括文章重点。"
                rows={4}
                className="w-full rounded-[1.35rem] border border-black/10 bg-white/85 px-4 py-3.5 text-sm text-black outline-none"
              />
              {errors.summary ? (
                <span className="text-danger text-sm">{errors.summary}</span>
              ) : (
                <span className="text-muted text-sm">
                  可选字段，建议控制在 2-3 句内。
                </span>
              )}
            </label>

            <label className="space-y-2.5">
              <span className="text-sm font-semibold text-black">Content</span>
              <textarea
                value={currentValues.content}
                onChange={(event) => updateField("content", event)}
                placeholder="写下完整正文内容，后续详情页会直接展示。"
                rows={18}
                className="w-full rounded-[1.6rem] border border-black/10 bg-white/85 px-4 py-4 text-sm leading-7 text-black outline-none"
              />
              {errors.content ? (
                <span className="text-danger text-sm">{errors.content}</span>
              ) : null}
            </label>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="surface-card rounded-[2rem] px-6 py-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <h3 className="editorial-title text-2xl text-black">
                  Publishing setup
                </h3>
                <p className="editorial-copy text-sm">
                  Choose a category and send the article to the protected API.
                </p>
              </div>

              <label className="space-y-2.5">
                <span className="text-sm font-semibold text-black">Category</span>
                <select
                  value={currentValues.categoryId}
                  onChange={(event) => updateField("categoryId", event)}
                  className="w-full rounded-[1.3rem] border border-black/10 bg-white/85 px-4 py-3 text-sm text-black outline-none"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId ? (
                  <span className="text-danger text-sm">{errors.categoryId}</span>
                ) : null}
              </label>

              {submitError ? (
                <div className="rounded-[1.35rem] border border-red-600/15 bg-red-50 px-4 py-3 text-sm text-red-900">
                  {submitError}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={mutation.isPending}
                className="bg-accent text-background flex w-full items-center justify-center rounded-[1.35rem] px-4 py-3.5 text-sm font-semibold shadow-[0_18px_40px_rgba(31,79,255,0.2)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {mutation.isPending
                  ? "Saving..."
                  : mode === "create"
                    ? "Publish article"
                    : "Save changes"}
              </button>
            </div>
          </section>

          <section className="surface-card rounded-[2rem] px-6 py-6">
            <h3 className="editorial-title text-2xl text-black">
              Notes for this milestone
            </h3>
            <ul className="editorial-copy mt-4 space-y-3 text-sm">
              <li>Only authenticated authors can submit this form.</li>
              <li>Editing another author&apos;s article is blocked in both UI and API.</li>
              <li>Categories come from the live FastAPI category endpoint.</li>
            </ul>
          </section>
        </aside>
      </form>
    </div>
  );
}
