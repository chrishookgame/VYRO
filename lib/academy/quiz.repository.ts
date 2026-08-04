import type {
  AcademyQuiz,
} from "./quiz";

const repository = new Map<
  string,
  AcademyQuiz
>();

export function saveAcademyQuiz(
  quiz: AcademyQuiz,
): void {
  repository.set(
    quiz.lessonId,
    quiz,
  );
}

export function getAcademyQuiz(
  lessonId: string,
): AcademyQuiz | null {
  return (
    repository.get(lessonId) ??
    null
  );
}

export function clearAcademyQuiz(
  lessonId: string,
): void {
  repository.delete(
    lessonId,
  );
}
