import type {
  AIRequest,
  AIResponse,
} from "../types";

import { runClaude } from "./claude";
import { runDeepSeek } from "./deepseek";
import { runGemini } from "./gemini";
import { runOpenAI } from "./openai";

export async function runProvider(
  request: AIRequest,
): Promise<AIResponse> {
  switch (request.provider) {
    case "openai":
      return runOpenAI(request);

    case "gemini":
      return runGemini(request);

    case "claude":
      return runClaude(request);

    case "deepseek":
      return runDeepSeek(request);

    default:
      return {
        success: false,
        provider: request.provider,
        content: "",
        error: `Proveedor de IA no soportado: ${request.provider}`,
      };
  }
}
