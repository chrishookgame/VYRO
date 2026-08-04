import { LearningPlayer } from "@/components/academy/LearningPlayer";
import type { AcademyCourse } from "@/lib/academy";

type CoursePreviewProps = {
  course: AcademyCourse;
};

function formatLevel(
  level: AcademyCourse["level"],
): string {
  const labels: Record<
    AcademyCourse["level"],
    string
  > = {
    beginner: "Principiante",
    intermediate: "Intermedio",
    advanced: "Avanzado",
  };

  return labels[level];
}

export function CoursePreview({
  course,
}: CoursePreviewProps) {
  return (
    <section className="mt-10 space-y-6">
      <header className="rounded-2xl border bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">
          Curso seleccionado
        </p>

        <h2 className="mt-2 text-3xl font-bold">
          {course.title}
        </h2>

        <p className="mt-3 text-gray-600">
          {course.description}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">
              Nivel
            </p>

            <p className="mt-1 font-semibold">
              {formatLevel(course.level)}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">
              Duración
            </p>

            <p className="mt-1 font-semibold">
              {course.estimatedHours} horas
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">
              Módulos
            </p>

            <p className="mt-1 font-semibold">
              {course.modules.length}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">
              Certificado
            </p>

            <p className="mt-1 font-semibold">
              {course.certificate
                ? "Disponible"
                : "No disponible"}
            </p>
          </div>
        </div>
      </header>

      <article className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-xl font-bold">
          Objetivo principal
        </h3>

        <p className="mt-3 text-gray-700">
          {course.objective}
        </p>
      </article>

      {course.skills.length > 0 ? (
        <article className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold">
            Competencias
          </h3>

          <ul className="mt-4 flex flex-wrap gap-3">
            {course.skills.map((skill) => (
              <li
                key={skill}
                className="rounded-full bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700"
              >
                {skill}
              </li>
            ))}
          </ul>
        </article>
      ) : null}

      <LearningPlayer
        key={course.id}
        course={course}
      />

      <div className="space-y-5">
        {course.modules.map(
          (academyModule, moduleIndex) => (
            <article
              key={
                academyModule.id ||
                `${academyModule.title}-${moduleIndex}`
              }
              className="rounded-2xl border bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">
                Módulo {moduleIndex + 1}
              </p>

              <h3 className="mt-2 text-2xl font-bold">
                {academyModule.title}
              </h3>

              <p className="mt-2 text-gray-600">
                {academyModule.description}
              </p>

              <div className="mt-6 space-y-3">
                {academyModule.lessons.map(
                  (lesson, lessonIndex) => (
                    <div
                      key={
                        lesson.id ||
                        `${lesson.title}-${lessonIndex}`
                      }
                      className="rounded-xl bg-gray-50 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-sm text-gray-500">
                            Lección {lessonIndex + 1}
                          </p>

                          <h4 className="mt-1 font-semibold">
                            {lesson.title}
                          </h4>
                        </div>

                        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600">
                          {lesson.durationMinutes} min
                        </span>
                      </div>

                      <p className="mt-3 text-sm text-gray-600">
                        {lesson.description}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </article>
          ),
        )}
      </div>

      <article className="rounded-2xl border bg-violet-950 p-6 text-white shadow-sm">
        <h3 className="text-xl font-bold">
          Proyecto final
        </h3>

        <p className="mt-3 text-violet-100">
          {course.finalProject}
        </p>
      </article>
    </section>
  );
}
