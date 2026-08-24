import {
  createAcademyCourse,
  serializeAcademyCourse,
} from "../../academy";
import { generateWithVIC } from "../../vic";
import type { AIResponse } from "../types";

export type GenerateAcademyCourseInput = {
  prompt: string;
  courseTitle?: string;
  moduleCount?: number;
  lessonsPerModule?: number;
};

function buildAcademySystemPrompt(): string {
  return [
    "Eres VYRO Academy AI, un diseñador instruccional profesional.",
    "Crea cursos claros, prácticos, progresivos y listos para utilizar.",
    "Responde únicamente con JSON válido.",
    "No uses bloques Markdown.",
    "No escribas texto antes ni después del JSON.",
    "",
    "Estructura requerida:",
    "{",
    '  "title": "Título del curso",',
    '  "description": "Descripción general",',
    '  "objective": "Objetivo principal",',
    '  "level": "beginner",',
    '  "estimatedHours": 12,',
    '  "skills": ["Competencia 1"],',
    '  "prerequisites": ["Requisito 1"],',
    '  "modules": [',
    "    {",
    '      "title": "Título del módulo",',
    '      "description": "Descripción del módulo",',
    '      "lessons": [',
    "        {",
    '          "title": "Título de la lección",',
    '          "description": "Descripción de la lección",',
    '          "content": "Contenido educativo",',
    '          "durationMinutes": 30',
    "        }",
    "      ]",
    "    }",
    "  ],",
    '  "finalProject": "Descripción del proyecto final",',
    '  "certificate": false',
    "}",
    "",
    "Reglas:",
    '- level solo puede ser "beginner", "intermediate" o "advanced".',
    "- Cada módulo debe contener al menos una lección.",
    "- estimatedHours debe ser mayor que cero.",
    "- durationMinutes debe ser un número entero no negativo.",
    "- Todo el contenido debe estar en español.",
    "- No incluyas propiedades adicionales.",
  ].join("\n");
}

function buildAcademyUserPrompt({
  prompt,
  courseTitle,
  moduleCount,
  lessonsPerModule,
}: GenerateAcademyCourseInput): string {
  const requestedModuleCount =
    moduleCount && moduleCount > 0
      ? moduleCount
      : 4;

  const requestedLessonsPerModule =
    lessonsPerModule &&
    lessonsPerModule > 0
      ? lessonsPerModule
      : 3;

  return [
    courseTitle
      ? `Curso actual: ${courseTitle}`
      : "Curso nuevo de VYRO Academy",
    "",
    `Solicitud del usuario: ${prompt.trim()}`,
    "",
    `Cantidad aproximada de módulos: ${requestedModuleCount}`,
    `Cantidad aproximada de lecciones por módulo: ${requestedLessonsPerModule}`,
    "",
    "Genera un curso completo y listo para VYRO Academy.",
  ].join("\n");
}

export async function generateAcademyCourse(
  input: GenerateAcademyCourseInput,
): Promise<AIResponse> {
  const cleanPrompt = input.prompt.trim();

  if (!cleanPrompt) {
    return {
      success: false,
      provider: "openai",
      content: "",
      error:
        "Escribe una solicitud para generar el curso.",
    };
  }

  const response = await generateWithVIC({
    module: "academy",
    capability: "courses",
    provider: "openai",
    systemPrompt: buildAcademySystemPrompt(),
    userPrompt: buildAcademyUserPrompt({
      ...input,
      prompt: cleanPrompt,
    }),
    temperature: 0.6,
    maxTokens: 4000,
  });

  if (!response.success) {
    return response;
  }


  try {
    const academyCourse =
      createAcademyCourse(response.content);

    return {
      ...response,
      content:
        serializeAcademyCourse(
          academyCourse,
        ),
    };
  } catch (error) {
    console.error(
      "VYRO Academy Engine failed:",
      error,
    );

    return {
      success: false,
      provider: response.provider,
      content: "",
      error:
        error instanceof Error
          ? error.message
          : "No fue posible procesar el curso generado.",
    };
  }
}