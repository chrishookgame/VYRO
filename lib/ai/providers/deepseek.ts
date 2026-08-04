import type { AIRequest, AIResponse } from "../types";

export async function runDeepSeek(
  request: AIRequest,
): Promise<AIResponse> {
  return {
    success: true,
    provider: "deepseek",
    content: [
      "DeepSeek Provider preparado.",
      "",
      request.userPrompt,
    ].join("\n"),
  };
}
