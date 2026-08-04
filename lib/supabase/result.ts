import type {
  PostgrestError,
} from "@supabase/supabase-js";

import {
  errorResult,
  successResult,
  type DataResult,
} from "@/lib/core";

export function fromSupabaseResult<T>(
  data: T | null,
  error: PostgrestError | null,
): DataResult<T> {
  if (error) {
    return errorResult<T>(
      error.message,
    );
  }

  if (data === null) {
    return errorResult<T>(
      "Supabase no devolvió datos.",
    );
  }

  return successResult(data);
}

export function fromSupabaseList<T>(
  data: T[] | null,
  error: PostgrestError | null,
): DataResult<T[]> {
  if (error) {
    return errorResult<T[]>(
      error.message,
    );
  }

  return successResult(
    data ?? [],
  );
}
