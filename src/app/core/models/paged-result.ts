export interface PagedResult<T> {
  hasNext: boolean;
  hasPrev: boolean;
  nextNum: number;
  prevNum: number;
  page: number;
  pages: number;
  perPage: number;
  total: number;
  data: T[];
  next: string;
  prev: string;
}
