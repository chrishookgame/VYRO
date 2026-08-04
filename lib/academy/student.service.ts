import { createStudentProfile } from "./profile";

export function getCurrentStudent() {
  const student = createStudentProfile("Christoph");

  return {
    ...student,
    progress: 25,
    enrolledCourses: [
      "React Básico",
    ],
    completedCourses: [],
    acquiredSkills: [
      "HTML",
      "CSS",
    ],
    learningGoals: [
      "Dominar React",
      "Crear aplicaciones modernas",
    ],
  };
}