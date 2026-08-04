export type AcademyBadge = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export const academyBadges: AcademyBadge[] = [
  {
    id: "first-course",
    title: "Primer Curso",
    description:
      "Completaste tu primer curso.",
    icon: "🎓",
  },
  {
    id: "five-courses",
    title: "Estudiante Constante",
    description:
      "Completaste cinco cursos.",
    icon: "📚",
  },
  {
    id: "perfect-score",
    title: "Excelencia",
    description:
      "Obtuviste una puntuación perfecta.",
    icon: "🏆",
  },
  {
    id: "ai-student",
    title: "Aprendiz IA",
    description:
      "Generaste tu primer curso con IA.",
    icon: "🤖",
  },
  {
    id: "master",
    title: "Maestro VYRO",
    description:
      "Alcanzaste un nivel destacado.",
    icon: "👑",
  },
];
