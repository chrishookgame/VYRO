import type {
  AIRequest,
  AIResponse,
} from "./types";

export async function runAI(
  request: AIRequest,
): Promise<AIResponse> {
  try {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    const result = (await response.json()) as AIResponse;

    if (!response.ok) {
      return {
        success: false,
        provider: request.provider,
        content: "",
        error:
          result.error ||
          "El Backend del VYRO AI Engine respondió con un error.",
      };
    }

    return result;
  } catch (error) {
    console.error(
      "VYRO AI Engine connection failed:",
      error,
    );

    return {
      success: false,
      provider: request.provider,
      content: "",
      error:
        "No fue posible conectar con el Backend del VYRO AI Engine.",
    };
  }
}
