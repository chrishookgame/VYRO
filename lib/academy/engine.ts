import {
  buildAcademyCourse,
  parseAcademyCourse,
  assertAcademyCourse,
} from "./index";

import type { AcademyCourse } from "./types";

export function createAcademyCourse(
  content: string,
): AcademyCourse {
  const parsed =
    parseAcademyCourse(content);

  const course =
    buildAcademyCourse(parsed);

  assertAcademyCourse(course);

  return course;
}
