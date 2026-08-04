import { runAI } from "../client";
import type { AIResponse } from "../types";

export type AcademyAIAction =
  | "course"
  | "modules"
  | "lessons"
  | "quiz";

type GenerateCoursePlanInput = {
  action: AcademyAIAction;
  courseTitle: string;
  request: string;
};

const actionInstructions: Record<AcademyAIAction, string> = {
  course:
    "Diseña un plan académico completo con objetivos, módulos, lecciones, actividades y evaluación.",
  modules:
    "Genera una estructura ordenada de módulos progresivos para el curso.",
  lessons:
    "Genera una propuesta de lecciones con objetivos, contenido, actividades y duración.",
  quiz:
    "Genera una evaluación educativa con diferentes tipos de preguntas y respuestas.",
};

export async function generateCoursePlan({
  action,
  courseTitle,
  request,
}: GenerateCoursePlanInput): Promise<AIResponse> {
  const userRequest =
    request.trim() ||
    `Crea una propuesta profesional para el curso "${courseTitle}".`;

  return runAI({
    module: "academy",
    provider: "openai",
    systemPrompt: [
      "Eres VYRO AI Teacher, un director académico inteligente.",
      "Tu función es diseñar experiencias educativas claras, prácticas y profesionales.",
      "Organiza siempre la respuesta con títulos, objetivos y pasos concretos.",
      actionInstructions[action],
    ].join(" "),
    userPrompt: [
      `Curso: ${courseTitle}`,
      `Acción solicitada: ${action}`,
      `Solicitud del usuario: ${userRequest}`,
    ].join("\n"),
    temperature: 0.7,
    maxTokens: 1500,
  });
}