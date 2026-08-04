import type { AIProvider } from "@/lib/ai/types";

import type { VICModule } from "./core";
import { getVICModule } from "./modules";

export type VICRoutingContext = {
  module: VICModule;
  preferredProvider?: AIProvider;
};

export type VICRoutingDecision = {
  provider: AIProvider;
  temperature: number;
  maxTokens: number;
};

export function routeVICRequest({
  module,
  preferredProvider,
}: VICRoutingContext): VICRoutingDecision {
  const moduleDefinition = getVICModule(module);

  return {
    provider:
      preferredProvider ??
      moduleDefinition.provider,
    temperature:
      moduleDefinition.temperature,
    maxTokens:
      moduleDefinition.maxTokens,
  };
}