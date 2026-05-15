import { apiRequest } from "@/lib/api/client";
import type {
  ArticleCreateRequest,
  ArticleDetail,
  ArticleListItem,
  ArticleUpdateRequest,
} from "@/types/article";
import type { PageData } from "@/types/api";

type ListArticlesParams = {
  page?: number;
  pageSize?: number;
  categoryId?: number;
  keyword?: string;
};

function buildQueryString(params: ListArticlesParams) {
  const searchParams = new URLSearchParams();

  if (params.page) {
    searchParams.set("page", String(params.page));
  }

  if (params.pageSize) {
    searchParams.set("page_size", String(params.pageSize));
  }

  if (params.categoryId) {
    searchParams.set("category_id", String(params.categoryId));
  }

  if (params.keyword) {
    searchParams.set("keyword", params.keyword);
  }

  const query = searchParams.toString();
  return query ? `/articles?${query}` : "/articles";
}

export function listArticles(params: ListArticlesParams = {}) {
  return apiRequest<PageData<ArticleListItem>>(buildQueryString(params), {
    method: "GET",
  });
}

export function getArticle(articleId: number, trackView = true) {
  const suffix = trackView ? "" : "?track_view=false";

  return apiRequest<ArticleDetail>(`/articles/${articleId}${suffix}`, {
    method: "GET",
  });
}

export function createArticle(payload: ArticleCreateRequest) {
  return apiRequest<ArticleDetail>("/articles", {
    method: "POST",
    body: payload,
    auth: true,
  });
}

export function updateArticle(articleId: number, payload: ArticleUpdateRequest) {
  return apiRequest<ArticleDetail>(`/articles/${articleId}`, {
    method: "PUT",
    body: payload,
    auth: true,
  });
}

export function deleteArticle(articleId: number) {
  return apiRequest<null>(`/articles/${articleId}`, {
    method: "DELETE",
    auth: true,
  });
}
