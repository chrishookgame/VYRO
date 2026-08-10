import OpenAI from "openai";

import type {
  AIRequest,
  AIResponse,
} from "../types";

function buildDevelopmentCourse(
  request: AIRequest,
): string {
  return [
    "CURSO GENERADO EN MODO DE DESARROLLO",
    "",
    `Solicitud: ${request.userPrompt}`,
    "",
    "Módulo 1: Fundamentos",
    "- Introducción al tema",
    "- Conceptos principales",
    "- Objetivos de aprendizaje",
    "",
    "Módulo 2: Aplicación práctica",
    "- Ejemplos guiados",
    "- Actividad práctica",
    "- Análisis de resultados",
    "",
    "Módulo 3: Desarrollo del proyecto",
    "- Planificación",
    "- Ejecución",
    "- Revisión y mejora",
    "",
    "Módulo 4: Evaluación",
    "- Preguntas de comprobación",
    "- Proyecto final",
    "- Criterios de evaluación",
    "",
    "Esta propuesta fue creada localmente porque OpenAI no tiene créditos disponibles.",
  ].join("\n");
}

export async function runOpenAI(
  request: AIRequest,
): Promise<AIResponse> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      provider: "openai",
      content: "",
      error:
        "El proveedor de IA no está disponible temporalmente.",
    };
  }

  try {
    const client = new OpenAI({
      apiKey,
    });

    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      instructions: request.systemPrompt,
      input: request.userPrompt,
      max_output_tokens: request.maxTokens ?? 1500,
    });

    const content = response.output_text.trim();

    if (!content) {
      return {
        success: false,
        provider: "openai",
        content: "",
        error:
          "OpenAI no devolvió contenido para esta solicitud.",
      };
    }

    return {
      success: true,
      provider: "openai",
      content,
      usage: response.usage
        ? {
            promptTokens: response.usage.input_tokens,
            completionTokens: response.usage.output_tokens,
            totalTokens: response.usage.total_tokens,
          }
        : undefined,
    };
  } catch (error) {
    console.error("VYRO OpenAI Provider error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Error desconocido de OpenAI.";

    const isCreditsError =
      error instanceof OpenAI.APIError &&
      error.status === 429 &&
      message.toLowerCase().includes("credits");

    const mockFallbackEnabled =
      process.env.NODE_ENV !== "production" &&
      process.env.VYRO_AI_MOCK_FALLBACK === "true";

    if (isCreditsError && mockFallbackEnabled) {
      return {
        success: true,
        provider: "openai",
        content: buildDevelopmentCourse(request),
      };
    }

    return {
      success: false,
      provider: "openai",
      content: "",
      error:
        "El proveedor de IA no pudo completar la solicitud.",
    };
  }
}
