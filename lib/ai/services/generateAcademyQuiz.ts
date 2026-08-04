import type {
  AcademyQuiz,
} from "@/lib/academy";

export type GenerateAcademyQuizInput = {
  lessonId?: string;
  lessonTitle: string;
  lessonDescription: string;
  lessonContent?: string;
};

function buildAcademyQuizPrompt(
  input: GenerateAcademyQuizInput,
): string {
  return [
    "Genera un cuestionario para la siguiente lección.",
    "",
    `Título: ${input.lessonTitle}`,
    "",
    `Descripción: ${input.lessonDescription}`,
    "",
    `Contenido: ${input.lessonContent ?? ""}`,
    "",
    "Devuelve exactamente 5 preguntas de opción múltiple.",
    "Cada pregunta debe incluir cuatro opciones.",
    "Indica el índice de la respuesta correcta.",
    "Incluye una explicación breve.",
  ].join("\n");
}

export async function generateAcademyQuiz(
  input: GenerateAcademyQuizInput,
): Promise<AcademyQuiz> {
  const quizPrompt =
    buildAcademyQuizPrompt(input);

  void quizPrompt;

  const lessonId =
    input.lessonId ??
    crypto.randomUUID();

  return {
    id: `quiz-${lessonId}`,
    lessonId,
    title: `Evaluación: ${input.lessonTitle}`,
    questions: [
      {
        id: `${lessonId}-question-1`,
        question:
          "¿Cuál es el objetivo principal de esta lección?",
        options: [
          input.lessonDescription ||
            "Comprender el contenido principal.",
          "Ignorar completamente el contenido.",
          "Evitar cualquier actividad práctica.",
          "Saltar directamente al proyecto final.",
        ],
        correctAnswer: 0,
        explanation:
          "La respuesta correcta corresponde al objetivo descrito en la lección.",
      },
    ],
  };
}
