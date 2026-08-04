export type EntityId = string;

export type Timestamp = string;

export type SortDirection =
  | "asc"
  | "desc";

export type PaginationParams = {
  page: number;
  pageSize: number;
};

export type PaginatedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type BaseEntity = {
  id: EntityId;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
};

export function calculateTotalPages(
  total: number,
  pageSize: number,
): number {
  if (pageSize <= 0) {
    return 0;
  }

  return Math.ceil(
    total / pageSize,
  );
}
