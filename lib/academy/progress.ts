import type { AcademyCourse } from "./types";
import type { StudentProfile } from "./profile";

export function completeCourse(
  profile: StudentProfile,
  course: AcademyCourse,
): StudentProfile {

  const completedCourses =
    profile.completedCourses.includes(course.id)
      ? profile.completedCourses
      : [...profile.completedCourses, course.id];

  const acquiredSkills = [
    ...new Set([
      ...profile.acquiredSkills,
      ...course.skills,
    ]),
  ];

  return {
    ...profile,
    completedCourses,
    acquiredSkills,
    progress: Math.min(
      100,
      profile.progress + 10,
    ),
    updatedAt: new Date().toISOString(),
  };
}
