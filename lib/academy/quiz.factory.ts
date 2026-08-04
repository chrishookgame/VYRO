import type {
  AcademyLesson,
  AcademyQuiz,
} from "./index";

type CreateLessonQuizOptions = {
  lesson: AcademyLesson;
  moduleIndex: number;
  lessonIndex: number;
};

function getLessonId(
  lesson: AcademyLesson,
  moduleIndex: number,
  lessonIndex: number,
): string {
  return (
    lesson.id ||
    `lesson-${moduleIndex}-${lessonIndex}`
  );
}

export function createLessonQuiz({
  lesson,
  moduleIndex,
  lessonIndex,
}: CreateLessonQuizOptions): AcademyQuiz {
  const lessonId = getLessonId(
    lesson,
    moduleIndex,
    lessonIndex,
  );

  return {
    id: `quiz-${lessonId}`,
    lessonId,
    title: `Evaluación: ${lesson.title}`,
    questions: [
      {
        id: `${lessonId}-question-1`,
        question:
          "¿Cuál es el objetivo principal de esta lección?",
        options: [
          lesson.description ||
            "Comprender el contenido principal.",
          "Ignorar completamente el tema.",
          "Evitar realizar actividades prácticas.",
          "Saltar directamente al proyecto final.",
        ],
        correctAnswer: 0,
        explanation:
          "La respuesta correcta corresponde a la descripción y al objetivo educativo de la lección.",
      },
      {
        id: `${lessonId}-question-2`,
        question:
          "¿Cuál es la mejor forma de aprovechar esta lección?",
        options: [
          "Leer rápidamente sin practicar.",
          "Estudiar el contenido y aplicar lo aprendido.",
          "Evitar tomar notas.",
          "Pasar inmediatamente a la siguiente lección.",
        ],
        correctAnswer: 1,
        explanation:
          "El aprendizaje mejora cuando se estudia el contenido y se aplica mediante práctica.",
      },
      {
        id: `${lessonId}-question-3`,
        question:
          "¿Qué debes hacer después de revisar el contenido?",
        options: [
          "Cerrar el curso definitivamente.",
          "Olvidar los conceptos estudiados.",
          "Comprobar tu comprensión y practicar.",
          "Eliminar la lección.",
        ],
        correctAnswer: 2,
        explanation:
          "Comprobar la comprensión y practicar ayuda a consolidar los conocimientos.",
      },
    ],
  };
}
