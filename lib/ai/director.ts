import { buildRecommendations } from "./recommendations";
import {
  type AIDirectorResponse,
  type VyroUserContext,
} from "./types";

function buildGreeting(displayName: string): string {
  return `Hola, ${displayName}. VYRO AI está listo para ayudarte.`;
}

function buildSummary(context: VyroUserContext): string {
  const parts = [
    `${context.activeProjects} proyectos activos`,
    `${context.pendingVideos} videos pendientes`,
    `${context.scheduledLives} transmisiones programadas`,
    `${context.unfinishedCourses} cursos sin terminar`,
  ];

  return `Hoy tienes ${parts.join(", ")}. Tu crecimiento semanal es de ${context.weeklyGrowthPercent}%.`;
}

export function runAIDirector(
  context: VyroUserContext,
): AIDirectorResponse {
  const recommendations = buildRecommendations(context);

  return {
    greeting: buildGreeting(context.displayName),
    summary: buildSummary(context),
    primaryRecommendation: recommendations[0] ?? null,
    recommendations,
  };
}