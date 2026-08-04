import { AIRecommendation, VyroUserContext } from "./types";

export function buildRecommendations(
  context: VyroUserContext
): AIRecommendation[] {
  const recommendations: AIRecommendation[] = [];

  if (context.scheduledLives > 0) {
    recommendations.push({
      id: "live-reminder",
      title: "Prepara tu próximo VYRO Live",
      description:
        "Tu transmisión está programada. Revisa cámara, audio y miniatura antes de comenzar.",
      module: "live",
      priority: "high",
      reason: "Hay una transmisión programada.",
      action: {
        label: "Abrir Live Studio",
        href: "/live/studio",
      },
    });
  }

  if (context.pendingVideos > 0) {
    recommendations.push({
      id: "creator-video",
      title: "Finaliza tus videos pendientes",
      description:
        "Tienes contenido listo para editar y publicar desde Creator Studio.",
      module: "creator",
      priority: "medium",
      reason: "Existen videos pendientes.",
      action: {
        label: "Abrir Creator Studio",
        href: "/ai",
      },
    });
  }

  if (context.unfinishedCourses > 0) {
    recommendations.push({
      id: "academy-course",
      title: "Continúa tu curso",
      description:
        "Completa las lecciones pendientes para mantener el ritmo de publicación.",
      module: "academy",
      priority: "medium",
      reason: "Hay cursos sin finalizar.",
      action: {
        label: "Ir a Academy",
        href: "/academy",
      },
    });
  }

  return recommendations;
}