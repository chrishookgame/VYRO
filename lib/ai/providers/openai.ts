import OpenAI from "openai";

import type {
  AIRequest,
  AIResponse,
} from "../types";

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


    return {
      success: false,
      provider: "openai",
      content: "",
      error:
        "El proveedor de IA no pudo completar la solicitud.",
    };
  }
}
