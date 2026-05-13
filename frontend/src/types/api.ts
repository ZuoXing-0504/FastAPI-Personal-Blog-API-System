export type ApiResponse<T> = {
  code: number;
  msg: string;
  data: T;
};

export type PageData<T> = {
  items: T[];
  total: number;
  page: number;
  page_size: number;
};
