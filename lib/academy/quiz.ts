export type AcademyQuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

export type AcademyQuiz = {
  id: string;
  lessonId: string;
  title: string;
  questions: AcademyQuizQuestion[];
};

export type AcademyQuizResult = {
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  passed: boolean;
};

export function calculateQuizResult(
  quiz: AcademyQuiz,
  answers: number[],
): AcademyQuizResult {
  let correctAnswers = 0;

  quiz.questions.forEach(
    (question, index) => {
      if (
        answers[index] ===
        question.correctAnswer
      ) {
        correctAnswers++;
      }
    },
  );

  const totalQuestions =
    quiz.questions.length;

  const percentage =
    totalQuestions === 0
      ? 0
      : Math.round(
          (correctAnswers /
            totalQuestions) *
            100,
        );

  return {
    totalQuestions,
    correctAnswers,
    percentage,
    passed: percentage >= 70,
  };
}
