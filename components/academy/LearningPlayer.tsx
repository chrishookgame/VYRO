"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { CourseNavigator } from "@/components/academy/CourseNavigator";
import { ModuleProgress } from "@/components/academy/ModuleProgress";
import { QuizPlayer } from "@/components/academy/QuizPlayer";
import {
  calculateAcademyProgress,
  canIssueCertificate,
  completeActiveAcademyLesson,
  createAcademyPlayerState,
  createCertificate,
  createLessonQuiz,
  getAcademyCertificate,
  getAcademyPlayerState,
  getActiveAcademyLesson,
  moveToNextAcademyLesson,
  moveToPreviousAcademyLesson,
  saveAcademyCertificate,
  saveAcademyPlayerState,
  selectAcademyLesson,
  type AcademyCertificate,
  type AcademyCourse,
} from "@/lib/academy";

type LearningPlayerProps = {
  course: AcademyCourse;
};

export function LearningPlayer({
  course,
}: LearningPlayerProps) {
  const [playerState, setPlayerState] =
    useState(() => {
      return (
        getAcademyPlayerState(course.id) ??
        createAcademyPlayerState(course)
      );
    });

  const [certificate, setCertificate] =
    useState<AcademyCertificate | null>(
      () =>
        getAcademyCertificate(
          course.id,
        ),
    );

  useEffect(() => {
    const savedState =
      getAcademyPlayerState(course.id);

    setPlayerState(
      savedState ??
        createAcademyPlayerState(course),
    );

    setCertificate(
      getAcademyCertificate(
        course.id,
      ),
    );
  }, [course]);

  useEffect(() => {
    saveAcademyPlayerState(
      playerState,
    );
  }, [playerState]);

  const activeLesson = useMemo(
    () =>
      getActiveAcademyLesson(
        course,
        playerState,
      ),
    [course, playerState],
  );

  const progress = useMemo(
    () =>
      calculateAcademyProgress(
        course,
        playerState,
      ),
    [course, playerState],
  );

  const activeModule =
    course.modules[
      playerState.activeModuleIndex
    ];

  const activeQuiz = useMemo(() => {
    if (!activeLesson) {
      return null;
    }

    return createLessonQuiz({
      lesson: activeLesson,
      moduleIndex:
        playerState.activeModuleIndex,
      lessonIndex:
        playerState.activeLessonIndex,
    });
  }, [
    activeLesson,
    playerState.activeLessonIndex,
    playerState.activeModuleIndex,
  ]);

  useEffect(() => {
    if (
      certificate ||
      !canIssueCertificate(
        course,
        playerState,
      )
    ) {
      return;
    }

    const existingCertificate =
      getAcademyCertificate(
        course.id,
      );

    if (existingCertificate) {
      setCertificate(
        existingCertificate,
      );
      return;
    }

    const newCertificate =
      createCertificate(
        course,
        "Estudiante VYRO",
        progress.percentage,
      );

    saveAcademyCertificate(
      newCertificate,
    );

    setCertificate(
      newCertificate,
    );
  }, [
    certificate,
    course,
    playerState,
    progress.percentage,
  ]);

  function completeLesson() {
    setPlayerState((state) =>
      completeActiveAcademyLesson(
        course,
        state,
      ),
    );
  }

  function completeAndContinue() {
    setPlayerState((state) => {
      const completedState =
        completeActiveAcademyLesson(
          course,
          state,
        );

      return moveToNextAcademyLesson(
        course,
        completedState,
      );
    });
  }

  function nextLesson() {
    setPlayerState((state) =>
      moveToNextAcademyLesson(
        course,
        state,
      ),
    );
  }

  function previousLesson() {
    setPlayerState((state) =>
      moveToPreviousAcademyLesson(
        course,
        state,
      ),
    );
  }

  function handleSelectLesson(
    moduleIndex: number,
    lessonIndex: number,
  ) {
    setPlayerState((state) =>
      selectAcademyLesson(
        course,
        state,
        moduleIndex,
        lessonIndex,
      ),
    );
  }

  return (
    <section className="mt-10">
      <div className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">
              Learning Player
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Estudia el curso paso a paso
            </h2>

            <p className="mt-2 text-gray-600">
              Tu avance se guarda automáticamente
              en este navegador.
            </p>
          </div>

          <div className="rounded-xl bg-violet-50 px-4 py-3 text-center">
            <p className="text-2xl font-bold text-violet-700">
              {progress.percentage}%
            </p>

            <p className="text-xs font-medium text-violet-600">
              completado
            </p>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-3 flex flex-wrap justify-between gap-2 text-sm">
            <span className="font-semibold">
              Progreso del curso
            </span>

            <span className="text-gray-500">
              {progress.completedLessons}
              {" de "}
              {progress.totalLessons}
              {" lecciones"}
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-violet-600 transition-all duration-300"
              style={{
                width: `${progress.percentage}%`,
              }}
            />
          </div>
        </div>
      </div>

      {certificate ? (
        <section className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
            Certificación completada
          </p>

          <h2 className="mt-2 text-2xl font-bold text-green-950">
            🎓 Certificado VYRO emitido
          </h2>

          <p className="mt-3 text-green-800">
            Has completado el curso y tu
            certificado fue generado
            automáticamente.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-white p-4">
              <p className="text-xs text-gray-500">
                Estudiante
              </p>

              <p className="mt-1 font-semibold">
                {certificate.studentName}
              </p>
            </div>

            <div className="rounded-xl bg-white p-4">
              <p className="text-xs text-gray-500">
                Resultado
              </p>

              <p className="mt-1 font-semibold">
                {certificate.percentage}%
              </p>
            </div>

            <div className="rounded-xl bg-white p-4">
              <p className="text-xs text-gray-500">
                Fecha
              </p>

              <p className="mt-1 font-semibold">
                {new Date(
                  certificate.issuedAt,
                ).toLocaleDateString(
                  "es-CL",
                )}
              </p>
            </div>

            <div className="rounded-xl bg-white p-4">
              <p className="text-xs text-gray-500">
                Identificador
              </p>

              <p className="mt-1 break-all text-sm font-semibold">
                {certificate.id}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <div className="grid items-start gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="space-y-6">
          <CourseNavigator
            course={course}
            playerState={playerState}
            onSelectLesson={handleSelectLesson}
          />

          <ModuleProgress
            course={course}
            playerState={playerState}
          />
        </div>

        <div className="space-y-6">
          <article className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">
                  {activeModule
                    ? `Módulo ${
                        playerState.activeModuleIndex +
                        1
                      }`
                    : "Curso"}
                </p>

                <h3 className="mt-2 text-3xl font-bold">
                  {activeLesson?.title ??
                    "Curso finalizado"}
                </h3>
              </div>

              {activeLesson ? (
                <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600">
                  {
                    activeLesson.durationMinutes
                  }{" "}
                  min
                </span>
              ) : null}
            </div>

            {activeModule ? (
              <p className="mt-3 text-sm font-medium text-gray-500">
                {activeModule.title}
              </p>
            ) : null}

            <p className="mt-6 text-base leading-8 text-gray-700">
              {activeLesson?.description ??
                "Has completado todas las lecciones del curso."}
            </p>

            {activeLesson?.content ? (
              <div className="mt-8 rounded-2xl bg-gray-50 p-6">
                <h4 className="text-lg font-bold">
                  Contenido de la lección
                </h4>

                <p className="mt-4 whitespace-pre-wrap leading-8 text-gray-700">
                  {activeLesson.content}
                </p>
              </div>
            ) : null}

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={previousLesson}
                className="rounded-xl bg-gray-200 px-5 py-3 font-semibold text-gray-800 transition hover:bg-gray-300"
              >
                ← Anterior
              </button>

              <button
                type="button"
                onClick={completeLesson}
                className="rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
              >
                ✓ Marcar completada
              </button>

              <button
                type="button"
                onClick={nextLesson}
                className="rounded-xl border border-violet-200 px-5 py-3 font-semibold text-violet-700 transition hover:bg-violet-50"
              >
                Siguiente →
              </button>

              <button
                type="button"
                onClick={completeAndContinue}
                className="rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-700"
              >
                Completar y continuar
              </button>
            </div>
          </article>

          {activeQuiz ? (
            <QuizPlayer
              key={activeQuiz.id}
              quiz={activeQuiz}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
