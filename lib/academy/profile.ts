export type StudentProfile = {
  id: string;

  name: string;

  level:
    | "beginner"
    | "intermediate"
    | "advanced";

  completedCourses: string[];

  enrolledCourses: string[];

  acquiredSkills: string[];

  learningGoals: string[];

  progress: number;

  certificates: string[];

  createdAt: string;

  updatedAt: string;
};

export function createStudentProfile(
  name = "",
): StudentProfile {

  const now =
    new Date().toISOString();

  return {
    id: crypto.randomUUID(),

    name,

    level: "beginner",

    completedCourses: [],

    enrolledCourses: [],

    acquiredSkills: [],

    learningGoals: [],

    progress: 0,

    certificates: [],

    createdAt: now,

    updatedAt: now,
  };
}
