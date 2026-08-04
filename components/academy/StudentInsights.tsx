import type { StudentProfile } from "@/lib/academy";

type StudentInsightsProps = {
  student: StudentProfile;
};

export function StudentInsights({
  student,
}: StudentInsightsProps) {
  return (
    <section className="mt-10 grid gap-6 lg:grid-cols-2">
      <article className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">
          Habilidades adquiridas
        </h2>

        {student.acquiredSkills.length > 0 ? (
          <ul className="mt-5 flex flex-wrap gap-3">
            {student.acquiredSkills.map(
              (skill) => (
                <li
                  key={skill}
                  className="rounded-full bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700"
                >
                  {skill}
                </li>
              ),
            )}
          </ul>
        ) : (
          <p className="mt-4 text-gray-600">
            Todavía no tienes habilidades
            registradas.
          </p>
        )}
      </article>

      <article className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">
          Objetivos de aprendizaje
        </h2>

        {student.learningGoals.length > 0 ? (
          <ul className="mt-5 space-y-3">
            {student.learningGoals.map(
              (goal) => (
                <li
                  key={goal}
                  className="rounded-xl bg-gray-50 p-4 text-sm text-gray-700"
                >
                  {goal}
                </li>
              ),
            )}
          </ul>
        ) : (
          <p className="mt-4 text-gray-600">
            Todavía no has definido objetivos.
          </p>
        )}
      </article>
    </section>
  );
}
