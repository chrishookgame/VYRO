export type AcademyLesson = {
  id: string;
  title: string;
  description: string;
  content: string;
  durationMinutes: number;
};

export type AcademyModule = {
  id: string;
  title: string;
  description: string;
  lessons: AcademyLesson[];
};

export type AcademyCourse = {
  id: string;
  title: string;
  description: string;
  objective: string;
  level:
    | "beginner"
    | "intermediate"
    | "advanced";
  estimatedHours: number;
  skills: string[];
  prerequisites: string[];
  modules: AcademyModule[];
  finalProject: string;
  certificate: boolean;
};
