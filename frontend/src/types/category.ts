export type CategorySimple = {
  id: number;
  name: string;
};

export type CategoryRead = {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type CategoryCreateRequest = {
  name: string;
  description?: string | null;
};
