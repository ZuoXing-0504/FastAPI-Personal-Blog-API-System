"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FolderKanban, LoaderCircle, Plus } from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/common/empty-state";
import { SkeletonBlock } from "@/components/common/skeleton-block";
import { ApiError } from "@/lib/api/client";
import { createCategory, listCategories } from "@/lib/api/categories";
import { formatDateLabel } from "@/lib/utils";

type CategoryFormValues = {
  name: string;
  description: string;
};

type CategoryFormErrors = Partial<Record<keyof CategoryFormValues, string>>;

const initialValues: CategoryFormValues = {
  name: "",
  description: "",
};

function validateCategory(values: CategoryFormValues) {
  const errors: CategoryFormErrors = {};

  if (!values.name.trim()) {
    errors.name = "请输入分类名称。";
  }

  if (values.name.trim().length > 100) {
    errors.name = "分类名称长度不能超过 100 个字符。";
  }

  if (values.description.trim().length > 500) {
    errors.description = "分类描述长度不能超过 500 个字符。";
  }

  return errors;
}

export function CategoryWorkspace() {
  const queryClient = useQueryClient();
  const [values, setValues] = useState<CategoryFormValues>(initialValues);
  const [errors, setErrors] = useState<CategoryFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: listCategories,
  });

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: (createdCategory) => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      toast.success(`分类 ${createdCategory.name} 创建成功。`);
      setValues(initialValues);
      setErrors({});
      setSubmitError(null);
    },
    onError: (error) => {
      const message =
        error instanceof ApiError ? error.message : "创建分类失败，请稍后再试。";
      setSubmitError(message);
      toast.error(message);
    },
  });

  function updateField(
    field: keyof CategoryFormValues,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setValues((current) => ({
      ...current,
      [field]: event.target.value,
    }));

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
    const nextErrors = validateCategory(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error("请先修正分类表单中的校验错误。");
      return;
    }

    await createMutation.mutateAsync({
      name: values.name.trim(),
      description: values.description.trim() || null,
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      <section className="surface-card rounded-[2rem] px-6 py-7 sm:px-8">
        <div className="space-y-6">
          <div className="space-y-3">
            <span className="editorial-eyebrow">Category management</span>
            <div className="space-y-3">
              <h2 className="editorial-title text-4xl text-black">
                Create the taxonomy for your articles.
              </h2>
              <p className="editorial-copy text-sm sm:text-base">
                Newly created categories become immediately available in the
                article editor and public filtering views.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="space-y-2.5">
              <span className="text-sm font-semibold text-black">Name</span>
              <input
                value={values.name}
                onChange={(event) => updateField("name", event)}
                placeholder="例如：技术、学习、生活"
                className="w-full rounded-[1.3rem] border border-black/10 bg-white/85 px-4 py-3.5 text-sm text-black outline-none"
              />
              {errors.name ? (
                <span className="text-danger text-sm">{errors.name}</span>
              ) : null}
            </label>

            <label className="space-y-2.5">
              <span className="text-sm font-semibold text-black">
                Description
              </span>
              <textarea
                value={values.description}
                onChange={(event) => updateField("description", event)}
                rows={5}
                placeholder="简单描述这个分类适合承载什么内容。"
                className="w-full rounded-[1.3rem] border border-black/10 bg-white/85 px-4 py-3.5 text-sm text-black outline-none"
              />
              {errors.description ? (
                <span className="text-danger text-sm">{errors.description}</span>
              ) : (
                <span className="text-muted text-sm">
                  可选字段，但建议让分类语义更清晰。
                </span>
              )}
            </label>

            {submitError ? (
              <div className="rounded-[1.3rem] border border-red-600/15 bg-red-50 px-4 py-3 text-sm text-red-900">
                {submitError}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={createMutation.isPending}
              className="bg-accent text-background flex w-full items-center justify-center gap-2 rounded-[1.3rem] px-4 py-3.5 text-sm font-semibold shadow-[0_18px_40px_rgba(31,79,255,0.18)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Plus className="size-4" />
              {createMutation.isPending ? "Creating..." : "Create category"}
            </button>
          </form>
        </div>
      </section>

      <section className="space-y-5">
        <div className="surface-card rounded-[2rem] px-6 py-6 sm:px-8">
          <div className="space-y-2">
            <p className="text-muted text-xs font-semibold tracking-[0.2em] uppercase">
              Category list
            </p>
            <h3 className="editorial-title text-3xl text-black">
              Current taxonomy
            </h3>
          </div>
        </div>

        {categoriesQuery.isLoading ? (
          <div className="grid gap-5 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="surface-card rounded-[1.75rem] p-6">
                <SkeletonBlock className="h-5 w-28" />
                <SkeletonBlock className="mt-4 h-16 w-full" />
                <SkeletonBlock className="mt-5 h-4 w-24" />
              </div>
            ))}
          </div>
        ) : categoriesQuery.isError ? (
          <EmptyState
            title="Failed to load categories"
            description="The category list is not available right now. Please check the backend service and try again."
            icon={<LoaderCircle className="size-5" />}
          />
        ) : (categoriesQuery.data ?? []).length === 0 ? (
          <EmptyState
            title="No categories yet"
            description="Create your first category so article publishing can bind to a structured taxonomy."
            icon={<FolderKanban className="size-5" />}
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {(categoriesQuery.data ?? []).map((category) => (
              <article
                key={category.id}
                className="surface-card rounded-[1.75rem] p-6"
              >
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold tracking-[0.16em] uppercase">
                  <span className="text-accent rounded-full bg-blue-50 px-3 py-1">
                    Category
                  </span>
                  <span className="text-muted">
                    {formatDateLabel(category.created_at)}
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  <h4 className="editorial-title text-2xl text-black">
                    {category.name}
                  </h4>
                  <p className="editorial-copy text-sm">
                    {category.description || "This category is ready to be used by new articles in the studio editor."}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
