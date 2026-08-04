import type {
  AcademyPlayerState,
} from "./player";

const STORAGE_KEY =
  "vyro-academy-player";

function loadRepository(): Record<
  string,
  AcademyPlayerState
> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw =
      localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return {};
    }

    return JSON.parse(raw) as Record<
      string,
      AcademyPlayerState
    >;
  } catch {
    return {};
  }
}

function saveRepository(
  repository: Record<
    string,
    AcademyPlayerState
  >,
): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(repository),
  );
}

export function getAcademyPlayerState(
  courseId: string,
): AcademyPlayerState | null {
  const repository =
    loadRepository();

  return (
    repository[courseId] ?? null
  );
}

export function saveAcademyPlayerState(
  state: AcademyPlayerState,
): void {
  const repository =
    loadRepository();

  repository[state.courseId] =
    state;

  saveRepository(repository);
}

export function deleteAcademyPlayerState(
  courseId: string,
): void {
  const repository =
    loadRepository();

  delete repository[courseId];

  saveRepository(repository);
}

export function getAcademyPlayerRepository() {
  return loadRepository();
}
