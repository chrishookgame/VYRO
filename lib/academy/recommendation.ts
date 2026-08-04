import type { AcademyCourse } from "./types";

export type AcademyRecommendation = {
  nextLevel:
    | "beginner"
    | "intermediate"
    | "advanced";
  suggestedTopics: string[];
};

const recommendationMap: Record<
  AcademyCourse["level"],
  AcademyRecommendation
> = {
  beginner: {
    nextLevel: "intermediate",
    suggestedTopics: [
      "Buenas prácticas",
      "Proyectos guiados",
      "Resolución de problemas",
    ],
  },

  intermediate: {
    nextLevel: "advanced",
    suggestedTopics: [
      "Arquitectura",
      "Optimización",
      "Patrones de diseño",
    ],
  },

  advanced: {
    nextLevel: "advanced",
    suggestedTopics: [
      "Investigación",
      "Mentoría",
      "Especialización",
    ],
  },
};

export function recommendNextCourse(
  course: AcademyCourse,
): AcademyRecommendation {
  return recommendationMap[course.level];
}
