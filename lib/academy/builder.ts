import type {
  AcademyCourse,
  AcademyLesson,
  AcademyModule,
} from "./types";

function generateId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

function buildLesson(
  lesson: AcademyLesson,
): AcademyLesson {
  return {
    ...lesson,
    id: lesson.id || generateId("lesson"),
  };
}

function buildModule(
  module: AcademyModule,
): AcademyModule {
  return {
    ...module,
    id: module.id || generateId("module"),
    lessons: module.lessons.map(buildLesson),
  };
}

export function buildAcademyCourse(
  course: AcademyCourse,
): AcademyCourse {
  return {
    ...course,
    id: course.id || generateId("course"),

    skills: [...course.skills],

    prerequisites: [
      ...course.prerequisites,
    ],

    modules: course.modules.map(buildModule),
  };
}
