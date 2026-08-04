import type { AIRequest, AIResponse } from "../types";

export async function runClaude(
  request: AIRequest,
): Promise<AIResponse> {
  return {
    success: true,
    provider: "claude",
    content: [
      "Claude Provider preparado.",
      "",
      request.userPrompt,
    ].join("\n"),
  };
}
