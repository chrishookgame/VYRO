import type {
  AcademyCourse,
  AcademyPlayerState,
} from "@/lib/academy";

type ModuleProgressProps = {
  course: AcademyCourse;
  playerState: AcademyPlayerState;
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

export function ModuleProgress({
  course,
  playerState,
}: ModuleProgressProps) {
  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <h3 className="text-xl font-bold">
        Progreso por módulo
      </h3>

      <div className="mt-6 space-y-5">
        {course.modules.map(
          (academyModule, moduleIndex) => {
            const completed =
              academyModule.lessons.filter(
                (lesson, lessonIndex) =>
                  playerState.completedLessonIds.includes(
                    getLessonId(
                      lesson.id,
                      moduleIndex,
                      lessonIndex,
                    ),
                  ),
              ).length;

            const total =
              academyModule.lessons.length;

            const percentage =
              total === 0
                ? 0
                : Math.round(
                    (completed / total) * 100,
                  );

            return (
              <article
                key={
                  academyModule.id ??
                  academyModule.title
                }
              >
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-semibold">
                    {academyModule.title}
                  </h4>

                  <span className="text-sm font-medium text-gray-500">
                    {percentage}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-violet-600 transition-all"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-sm text-gray-500">
                  {completed} de {total} lecciones
                  completadas
                </p>
              </article>
            );
          },
        )}
      </div>
    </section>
  );
}
