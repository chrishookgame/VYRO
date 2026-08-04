export interface ParsedLesson {
  title: string;
  description: string;
}

export interface ParsedModule {
  title: string;
  description: string;
  lessons: ParsedLesson[];
}

export interface ParsedCourse {
  title: string;
  description: string;
  modules: ParsedModule[];
}

export function parseCourseResponse(
  content: string,
): ParsedCourse {
  return {
    title: "Curso generado por VYRO AI",
    description:
      "Estructura inicial generada automáticamente.",

    modules: [
      {
        title: "Módulo 1",
        description: "Primer módulo del curso.",

        lessons: [
          {
            title: "Lección 1",
            description: content,
          },
        ],
      },
    ],
  };
}