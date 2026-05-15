import type { CategorySimple } from "./category";

export type ArticleAuthor = {
  id: number;
  username: string;
};

export type ArticleListItem = {
  id: number;
  title: string;
  summary: string | null;
  author: ArticleAuthor;
  category: CategorySimple;
  created_at: string;
};

export type ArticleDetail = ArticleListItem & {
  content: string;
  view_count: number;
  updated_at: string;
};

export type ArticleCreateRequest = {
  title: string;
  summary?: string | null;
  content: string;
  category_id: number;
};

export type ArticleUpdateRequest = Partial<ArticleCreateRequest>;
