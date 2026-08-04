import type {
  AcademyCourse,
  AcademyPlayerState,
} from "@/lib/academy";

type CourseNavigatorProps = {
  course: AcademyCourse;
  playerState: AcademyPlayerState;
  onSelectLesson: (
    moduleIndex: number,
    lessonIndex: number,
  ) => void;
};

function getLessonId(
  lessonId: string,
  moduleIndex: number,
  lessonIndex: number,
): string {
  return (
    lessonId ||
    `lesson-${moduleIndex}-${lessonIndex}`
  );
}

export function CourseNavigator({
  course,
  playerState,
  onSelectLesson,
}: CourseNavigatorProps) {
  return (
    <aside className="rounded-2xl border bg-white p-5 shadow-sm">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">
          Contenido del curso
        </p>

        <h3 className="mt-2 text-xl font-bold">
          Módulos y lecciones
        </h3>

        <p className="mt-2 text-sm text-gray-600">
          Selecciona cualquier lección para continuar.
        </p>
      </div>

      <div className="mt-6 space-y-5">
        {course.modules.map(
          (academyModule, moduleIndex) => (
            <section
              key={
                academyModule.id ||
                `${academyModule.title}-${moduleIndex}`
              }
              className="rounded-xl border bg-gray-50 p-4"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">
                  {moduleIndex + 1}
                </span>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    {academyModule.title}
                  </h4>

                  <p className="mt-1 text-xs text-gray-500">
                    {academyModule.lessons.length} lecciones
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {academyModule.lessons.map(
                  (lesson, lessonIndex) => {
                    const lessonId =
                      getLessonId(
                        lesson.id,
                        moduleIndex,
                        lessonIndex,
                      );

                    const isCompleted =
                      playerState.completedLessonIds.includes(
                        lessonId,
                      );

                    const isActive =
                      playerState.activeModuleIndex ===
                        moduleIndex &&
                      playerState.activeLessonIndex ===
                        lessonIndex;

                    return (
                      <button
                        key={lessonId}
                        type="button"
                        onClick={() =>
                          onSelectLesson(
                            moduleIndex,
                            lessonIndex,
                          )
                        }
                        className={[
                          "flex w-full items-start gap-3 rounded-xl border p-3 text-left transition",
                          isActive
                            ? "border-violet-300 bg-violet-50"
                            : "border-transparent bg-white hover:border-gray-200 hover:bg-gray-50",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                            isCompleted
                              ? "bg-green-100 text-green-700"
                              : isActive
                                ? "bg-violet-600 text-white"
                                : "bg-gray-100 text-gray-500",
                          ].join(" ")}
                        >
                          {isCompleted
                            ? "✓"
                            : lessonIndex + 1}
                        </span>

                        <span className="min-w-0">
                          <span
                            className={[
                              "block text-sm font-medium",
                              isActive
                                ? "text-violet-800"
                                : "text-gray-800",
                            ].join(" ")}
                          >
                            {lesson.title}
                          </span>

                          <span className="mt-1 block text-xs text-gray-500">
                            {lesson.durationMinutes} min
                          </span>
                        </span>
                      </button>
                    );
                  },
                )}
              </div>
            </section>
          ),
        )}
      </div>
    </aside>
  );
}
