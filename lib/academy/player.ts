import type {
  AcademyCourse,
  AcademyLesson,
} from "./types";

export type AcademyPlayerState = {
  courseId: string;
  activeModuleIndex: number;
  activeLessonIndex: number;
  completedLessonIds: string[];
};

export type AcademyPlayerProgress = {
  completedLessons: number;
  totalLessons: number;
  percentage: number;
};

function getLessonId(
  lesson: AcademyLesson,
  moduleIndex: number,
  lessonIndex: number,
): string {
  return (
    lesson.id ||
    `lesson-${moduleIndex}-${lessonIndex}`
  );
}

export function createAcademyPlayerState(
  course: AcademyCourse,
): AcademyPlayerState {
  return {
    courseId: course.id,
    activeModuleIndex: 0,
    activeLessonIndex: 0,
    completedLessonIds: [],
  };
}

export function getActiveAcademyLesson(
  course: AcademyCourse,
  state: AcademyPlayerState,
): AcademyLesson | null {
  const academyModule =
    course.modules[state.activeModuleIndex];

  if (!academyModule) {
    return null;
  }

  return (
    academyModule.lessons[
      state.activeLessonIndex
    ] ?? null
  );
}

export function calculateAcademyProgress(
  course: AcademyCourse,
  state: AcademyPlayerState,
): AcademyPlayerProgress {
  const totalLessons =
    course.modules.reduce(
      (total, academyModule) =>
        total +
        academyModule.lessons.length,
      0,
    );

  const availableLessonIds =
    new Set(
      course.modules.flatMap(
        (academyModule, moduleIndex) =>
          academyModule.lessons.map(
            (lesson, lessonIndex) =>
              getLessonId(
                lesson,
                moduleIndex,
                lessonIndex,
              ),
          ),
      ),
    );

  const completedLessons =
    new Set(
      state.completedLessonIds.filter(
        (lessonId) =>
          availableLessonIds.has(lessonId),
      ),
    ).size;

  const percentage =
    totalLessons === 0
      ? 0
      : Math.round(
          (completedLessons /
            totalLessons) *
            100,
        );

  return {
    completedLessons,
    totalLessons,
    percentage,
  };
}

export function completeActiveAcademyLesson(
  course: AcademyCourse,
  state: AcademyPlayerState,
): AcademyPlayerState {
  const activeLesson =
    getActiveAcademyLesson(
      course,
      state,
    );

  if (!activeLesson) {
    return state;
  }

  const activeLessonId =
    getLessonId(
      activeLesson,
      state.activeModuleIndex,
      state.activeLessonIndex,
    );

  if (
    state.completedLessonIds.includes(
      activeLessonId,
    )
  ) {
    return state;
  }

  return {
    ...state,
    completedLessonIds: [
      ...state.completedLessonIds,
      activeLessonId,
    ],
  };
}

export function moveToNextAcademyLesson(
  course: AcademyCourse,
  state: AcademyPlayerState,
): AcademyPlayerState {
  const academyModule =
    course.modules[state.activeModuleIndex];

  if (!academyModule) {
    return state;
  }

  const hasNextLesson =
    state.activeLessonIndex <
    academyModule.lessons.length - 1;

  if (hasNextLesson) {
    return {
      ...state,
      activeLessonIndex:
        state.activeLessonIndex + 1,
    };
  }

  const hasNextModule =
    state.activeModuleIndex <
    course.modules.length - 1;

  if (!hasNextModule) {
    return state;
  }

  return {
    ...state,
    activeModuleIndex:
      state.activeModuleIndex + 1,
    activeLessonIndex: 0,
  };
}

export function moveToPreviousAcademyLesson(
  course: AcademyCourse,
  state: AcademyPlayerState,
): AcademyPlayerState {
  if (state.activeLessonIndex > 0) {
    return {
      ...state,
      activeLessonIndex:
        state.activeLessonIndex - 1,
    };
  }

  if (state.activeModuleIndex === 0) {
    return state;
  }

  const previousModuleIndex =
    state.activeModuleIndex - 1;

  const previousModule =
    course.modules[previousModuleIndex];

  return {
    ...state,
    activeModuleIndex:
      previousModuleIndex,
    activeLessonIndex: Math.max(
      0,
      previousModule.lessons.length - 1,
    ),
  };
}

export function selectAcademyLesson(
  course: AcademyCourse,
  state: AcademyPlayerState,
  moduleIndex: number,
  lessonIndex: number,
): AcademyPlayerState {
  const academyModule =
    course.modules[moduleIndex];

  if (!academyModule) {
    return state;
  }

  if (
    !academyModule.lessons[lessonIndex]
  ) {
    return state;
  }

  return {
    ...state,
    activeModuleIndex: moduleIndex,
    activeLessonIndex: lessonIndex,
  };
}
