import type { AIRequest, AIResponse } from "../types";

export async function runGemini(
  request: AIRequest,
): Promise<AIResponse> {
  return {
    success: true,
    provider: "gemini",
    content: [
      "Gemini Provider preparado.",
      "",
      request.userPrompt,
    ].join("\n"),
  };
}
