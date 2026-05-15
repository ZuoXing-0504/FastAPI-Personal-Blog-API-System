import { apiRequest } from "@/lib/api/client";
import type { CategoryCreateRequest, CategoryRead } from "@/types/category";

export function listCategories() {
  return apiRequest<CategoryRead[]>("/categories", {
    method: "GET",
  });
}

export function createCategory(payload: CategoryCreateRequest) {
  return apiRequest<CategoryRead>("/categories", {
    method: "POST",
    body: payload,
    auth: true,
  });
}
