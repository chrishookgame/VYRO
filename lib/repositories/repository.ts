import type { DataResult } from "@/lib/core";

export interface Repository<T, Create = Partial<T>, Update = Partial<T>> {
  findAll(): Promise<DataResult<T[]>>;
  findById(id: string): Promise<DataResult<T>>;
  create(data: Create): Promise<DataResult<T>>;
  update(id: string, data: Update): Promise<DataResult<T>>;
  remove(id: string): Promise<DataResult<boolean>>;
}
