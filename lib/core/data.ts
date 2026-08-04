export type DataStatus =
  | "idle"
  | "loading"
  | "success"
  | "error";

export type DataResult<T> =
  | {
      success: true;
      data: T;
      error: null;
    }
  | {
      success: false;
      data: null;
      error: string;
    };

export type AsyncData<T> = {
  status: DataStatus;
  data: T | null;
  error: string | null;
};

export function successResult<T>(
  data: T,
): DataResult<T> {
  return {
    success: true,
    data,
    error: null,
  };
}

export function errorResult<T = never>(
  error: unknown,
): DataResult<T> {
  return {
    success: false,
    data: null,
    error: getErrorMessage(error),
  };
}

export function getErrorMessage(
  error: unknown,
): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === "string" &&
    error.trim()
  ) {
    return error;
  }

  return "Ocurrió un error inesperado.";
}

export function createIdleData<T>(): AsyncData<T> {
  return {
    status: "idle",
    data: null,
    error: null,
  };
}

export async function executeDataRequest<T>(
  request: () => Promise<T>,
): Promise<DataResult<T>> {
  try {
    const data =
      await request();

    return successResult(data);
  } catch (error) {
    return errorResult<T>(error);
  }
}
