import type { AcademyCourse } from "@/lib/academy";

type CourseHistoryProps = {
  courses: AcademyCourse[];
  onOpen: (course: AcademyCourse) => void;
  onDelete: (courseId: string) => void;
};

function formatLevel(
  level: AcademyCourse["level"],
): string {
  const labels = {
    beginner: "Principiante",
    intermediate: "Intermedio",
    advanced: "Avanzado",
  };

  return labels[level];
}

export function CourseHistory({
  courses,
  onOpen,
  onDelete,
}: CourseHistoryProps) {
  return (
    <section className="mt-10 rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Mis cursos guardados
        </h2>

        <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-700">
          {courses.length} cursos
        </span>
      </div>

      {courses.length === 0 ? (
        <p className="mt-6 text-gray-600">
          Todavía no tienes cursos guardados.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {courses.map((course) => (
            <article
              key={course.id}
              className="rounded-xl border p-5"
            >
              <p className="text-sm font-semibold text-violet-600">
                {formatLevel(course.level)}
              </p>

              <h3 className="mt-2 text-xl font-bold">
                {course.title}
              </h3>

              <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                {course.description}
              </p>

              <div className="mt-4 flex gap-2 text-xs text-gray-500">
                <span className="rounded-full bg-gray-100 px-3 py-1">
                  {course.modules.length} módulos
                </span>

                <span className="rounded-full bg-gray-100 px-3 py-1">
                  {course.estimatedHours} horas
                </span>
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => onOpen(course)}
                  className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
                >
                  Abrir
                </button>

                <button
                  onClick={() => onDelete(course.id)}
                  className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}