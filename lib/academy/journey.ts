import type { AcademyCourse } from "./types";

export type LearningJourney = {
  currentCourse: string;
  currentLevel: AcademyCourse["level"];
  nextLevel: AcademyCourse["level"];
  acquiredSkills: string[];
  recommendedCourses: string[];
  nextGoals: string[];
};

const LEVEL_FLOW: Record<
  AcademyCourse["level"],
  AcademyCourse["level"]
> = {
  beginner: "intermediate",
  intermediate: "advanced",
  advanced: "advanced",
};

const COURSE_FLOW: Record<
  AcademyCourse["level"],
  string[]
> = {
  beginner: [
    "Proyecto práctico",
    "Curso Intermedio",
    "Desafíos guiados",
  ],

  intermediate: [
    "Curso Avanzado",
    "Arquitectura",
    "Proyecto profesional",
  ],

  advanced: [
    "Especialización",
    "Mentoría",
    "Investigación",
  ],
};

const GOALS: Record<
  AcademyCourse["level"],
  string[]
> = {
  beginner: [
    "Dominar los fundamentos",
    "Practicar diariamente",
    "Crear proyectos simples",
  ],

  intermediate: [
    "Resolver problemas reales",
    "Construir aplicaciones completas",
    "Optimizar código",
  ],

  advanced: [
    "Especializarse",
    "Crear productos",
    "Liderar equipos",
  ],
};

export function buildLearningJourney(
  course: AcademyCourse,
): LearningJourney {

  return {

    currentCourse: course.title,

    currentLevel: course.level,

    nextLevel: LEVEL_FLOW[course.level],

    acquiredSkills: [...course.skills],

    recommendedCourses:
      COURSE_FLOW[course.level],

    nextGoals:
      GOALS[course.level],

  };

}
