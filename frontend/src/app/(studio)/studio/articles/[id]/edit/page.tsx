import { notFound } from "next/navigation";

import { ArticleEditorForm } from "@/components/studio/article-editor-form";

type EditStudioArticlePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditStudioArticlePage({
  params,
}: EditStudioArticlePageProps) {
  const resolvedParams = await params;
  const articleId = Number(resolvedParams.id);

  if (Number.isNaN(articleId) || articleId <= 0) {
    notFound();
  }

  return <ArticleEditorForm mode="edit" articleId={articleId} />;
}
