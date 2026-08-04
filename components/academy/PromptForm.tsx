"use client";

type PromptFormProps = {
  prompt: string;
  generating: boolean;
  error?: string;
  onPromptChange: (value: string) => void;
  onSubmit: () => void;
};

export function PromptForm({
  prompt,
  generating,
  error,
  onPromptChange,
  onSubmit,
}: PromptFormProps) {
  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <section className="mt-10 rounded-2xl border bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">
        Academy Intelligence
      </p>

      <h2 className="mt-2 text-2xl font-bold">
        Generar un curso con IA
      </h2>

      <p className="mt-2 max-w-3xl text-gray-600">
        Describe lo que quieres aprender. VIC generará,
        procesará y validará la estructura académica.
      </p>

      <form
        className="mt-6"
        onSubmit={handleSubmit}
      >
        <label
          htmlFor="academy-course-prompt"
          className="text-sm font-semibold text-gray-800"
        >
          Tema u objetivo del curso
        </label>

        <textarea
          id="academy-course-prompt"
          value={prompt}
          onChange={(event) =>
            onPromptChange(event.target.value)
          }
          placeholder="Ejemplo: Quiero aprender React desde cero y crear una aplicación profesional."
          className="mt-2 min-h-36 w-full resize-y rounded-2xl border border-gray-300 p-4 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
          disabled={generating}
        />

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={
              generating || !prompt.trim()
            }
            className="rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {generating
              ? "Generando curso..."
              : "Generar curso"}
          </button>

          <p className="text-sm text-gray-500">
            Los cursos válidos se guardan
            automáticamente.
          </p>
        </div>
      </form>

      {error ? (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      ) : null}
    </section>
  );
}
