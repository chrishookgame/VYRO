import type { AIProvider } from "@/lib/ai/types";

import type { VICModule } from "./core";

export type VICModuleDefinition = {
  id: VICModule;
  name: string;
  description: string;
  status: "active" | "beta" | "experimental";
  provider: AIProvider;
  temperature: number;
  maxTokens: number;
  capabilities: string[];
};

export const VIC_MODULES: Record<
  VICModule,
  VICModuleDefinition
> = {
  academy: {
    id: "academy",
    name: "VYRO Academy",
    description: "Generación y gestión de cursos inteligentes.",
    status: "active",
    provider: "openai",
    temperature: 0.6,
    maxTokens: 4000,
    capabilities: [
      "courses",
      "lessons",
      "quizzes",
    ],
  },

  creator: {
    id: "creator",
    name: "VYRO Creator",
    description: "Creación de contenido multimedia.",
    status: "active",
    provider: "openai",
    temperature: 0.8,
    maxTokens: 3000,
    capabilities: [
      "posts",
      "scripts",
      "ideas",
    ],
  },

  live: {
    id: "live",
    name: "VYRO Live",
    description: "Asistencia inteligente para transmisiones.",
    status: "active",
    provider: "openai",
    temperature: 0.5,
    maxTokens: 1500,
    capabilities: [
      "moderation",
      "assistant",
      "engagement",
    ],
  },

  business: {
    id: "business",
    name: "VYRO Business",
    description: "Asistente estratégico para empresas.",
    status: "active",
    provider: "openai",
    temperature: 0.4,
    maxTokens: 2500,
    capabilities: [
      "analysis",
      "strategy",
      "planning",
    ],
  },

  marketplace: {
    id: "marketplace",
    name: "VYRO Marketplace",
    description: "Optimización de productos y servicios.",
    status: "active",
    provider: "openai",
    temperature: 0.6,
    maxTokens: 2000,
    capabilities: [
      "catalog",
      "products",
      "marketing",
    ],
  },
};

export function getVICModule(
  module: VICModule,
): VICModuleDefinition {
  return VIC_MODULES[module];
}