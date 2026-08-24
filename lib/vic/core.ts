import { getErrorMessage } from "@/lib/core";

import { runAI } from "@/lib/ai/client";
import type {
  AIRequest,
  AIResponse,
} from "@/lib/ai/types";

import { assertVICCapability } from "./capabilities";
import { buildVICContext } from "./context";
import { buildVICSystemPrompt } from "./prompts";
import { routeVICRequest } from "./router";

export type VICModule =
  | "academy"
  | "creator"
  | "live"
  | "business"
  | "marketplace";

export type VICGenerateRequest = {
  module: VICModule;
  capability: string;
  systemPrompt: string;
  userPrompt: string;
  provider?: AIRequest["provider"];
  temperature?: number;
  maxTokens?: number;
};

export async function generateWithVIC(
  request: VICGenerateRequest,
): Promise<AIResponse> {
  try {
    assertVICCapability({
      module: request.module,
      capability: request.capability,
    });

    const context = buildVICContext({
      module: request.module,
    });

    const routing = routeVICRequest({
      module: request.module,
      preferredProvider: request.provider,
    });

    const systemPrompt = buildVICSystemPrompt({
      module: request.module,
      context,
      systemPrompt: request.systemPrompt,
    });

    const aiRequest: AIRequest = {
      module: request.module,
      provider: routing.provider,
      systemPrompt,
      userPrompt: request.userPrompt,
      temperature:
        request.temperature ??
        routing.temperature,
      maxTokens:
        request.maxTokens ??
        routing.maxTokens,
    };

    return await runAI(aiRequest);
  } catch (error) {
    console.error("VIC Core Error:", getErrorMessage(error));

    return {
      success: false,
      provider: request.provider ?? "openai",
      content: "",
      error:
        error instanceof Error
          ? error.message
          : "Error interno del VYRO Intelligence Core.",
    };
  }
}