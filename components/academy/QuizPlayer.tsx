"use client";

import { useState } from "react";

import {
  calculateQuizResult,
  type AcademyQuiz,
} from "@/lib/academy";

type QuizPlayerProps = {
  quiz: AcademyQuiz;
};

export function QuizPlayer({
  quiz,
}: QuizPlayerProps) {
  const [answers, setAnswers] =
    useState<number[]>(
      Array(quiz.questions.length).fill(-1),
    );

  const [submitted, setSubmitted] =
    useState(false);

  const result =
    calculateQuizResult(
      quiz,
      answers,
    );

  function selectAnswer(
    questionIndex: number,
    optionIndex: number,
  ) {
    const updated = [...answers];

    updated[questionIndex] =
      optionIndex;

    setAnswers(updated);
  }

  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold">
        Evaluación
      </h2>

      <p className="mt-2 text-gray-600">
        {quiz.title}
      </p>

      <div className="mt-8 space-y-8">
        {quiz.questions.map(
          (
            question,
            questionIndex,
          ) => (
            <article
              key={question.id}
            >
              <h3 className="font-semibold">
                {questionIndex + 1}.{" "}
                {question.question}
              </h3>

              <div className="mt-4 space-y-2">
                {question.options.map(
                  (
                    option,
                    optionIndex,
                  ) => (
                    <button
                      key={optionIndex}
                      type="button"
                      onClick={() =>
                        selectAnswer(
                          questionIndex,
                          optionIndex,
                        )
                      }
                      className={[
                        "block w-full rounded-xl border p-3 text-left transition",
                        answers[
                          questionIndex
                        ] ===
                        optionIndex
                          ? "border-violet-500 bg-violet-50"
                          : "hover:bg-gray-50",
                      ].join(" ")}
                    >
                      {option}
                    </button>
                  ),
                )}
              </div>
            </article>
          ),
        )}
      </div>

      {!submitted ? (
        <button
          type="button"
          onClick={() =>
            setSubmitted(true)
          }
          className="mt-10 rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white"
        >
          Corregir evaluación
        </button>
      ) : (
        <div className="mt-10 rounded-2xl border bg-violet-50 p-6">
          <h3 className="text-xl font-bold">
            Resultado
          </h3>

          <div className="mt-4 space-y-2">
            <p>
              Correctas:{" "}
              {
                result.correctAnswers
              }
            </p>

            <p>
              Total:{" "}
              {
                result.totalQuestions
              }
            </p>

            <p>
              Nota:{" "}
              {
                result.percentage
              }
              %
            </p>

            <p className="font-bold">
              {result.passed
                ? "✅ Aprobado"
                : "❌ Reprobado"}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
