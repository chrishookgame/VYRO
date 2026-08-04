"use client";

import {
  useEffect,
  useState,
} from "react";

import { BadgeGallery } from "@/components/academy/BadgeGallery";
import { CertificateHistory } from "@/components/academy/CertificateHistory";
import { CertificateStatistics } from "@/components/academy/CertificateStatistics";
import { CertificateVerifier } from "@/components/academy/CertificateVerifier";
import { CourseHistory } from "@/components/academy/CourseHistory";
import { CoursePreview } from "@/components/academy/CoursePreview";
import { PromptForm } from "@/components/academy/PromptForm";
import { RewardHistory } from "@/components/academy/RewardHistory";
import { RewardPanel } from "@/components/academy/RewardPanel";
import { StatCard } from "@/components/academy/StatCard";
import { StudentInsights } from "@/components/academy/StudentInsights";
import { XpCard } from "@/components/academy/XpCard";
import {
  deleteSavedAcademyCourse,
  getSavedAcademyCourses,
  saveAcademyCourse,
} from "@/lib/academy";
import type {
  AcademyCourse,
  StudentProfile,
} from "@/lib/academy";
import { generateAcademyCourse } from "@/lib/ai/services/generateAcademyCourse";

type AcademyDashboardClientProps = {
  student: StudentProfile;
};

function formatLevel(
  level: StudentProfile["level"],
): string {
  const labels: Record<
    StudentProfile["level"],
    string
  > = {
    beginner: "Principiante",
    intermediate: "Intermedio",
    advanced: "Avanzado",
  };

  return labels[level];
}

export function AcademyDashboardClient({
  student,
}: AcademyDashboardClientProps) {
  const [prompt, setPrompt] = useState("");
  const [course, setCourse] =
    useState<AcademyCourse | null>(null);
  const [savedCourses, setSavedCourses] =
    useState<AcademyCourse[]>([]);
  const [developmentContent, setDevelopmentContent] =
    useState("");
  const [error, setError] = useState("");
  const [generating, setGenerating] =
    useState(false);

  useEffect(() => {
    setSavedCourses(
      getSavedAcademyCourses(),
    );
  }, []);

  const currentCourse =
    course?.title ??
    student.enrolledCourses[0] ??
    "Sin iniciar";

  async function handleGenerateCourse() {
    const cleanPrompt = prompt.trim();

    if (!cleanPrompt) {
      setError(
        "Escribe el tema del curso que deseas generar.",
      );
      return;
    }

    setGenerating(true);
    setError("");
    setCourse(null);
    setDevelopmentContent("");

    try {
      const response =
        await generateAcademyCourse({
          prompt: cleanPrompt,
        });

      if (!response.success) {
        setError(
          response.error ??
            "No fue posible generar el curso.",
        );
        return;
      }

      try {
        const generatedCourse =
          JSON.parse(
            response.content,
          ) as AcademyCourse;

        setCourse(generatedCourse);

        const updatedCourses =
          saveAcademyCourse(
            generatedCourse,
          );

        setSavedCourses(updatedCourses);
      } catch {
        setDevelopmentContent(
          response.content,
        );
      }
    } catch (generationError) {
      console.error(
        "VYRO Academy Dashboard error:",
        generationError,
      );

      setError(
        generationError instanceof Error
          ? generationError.message
          : "Ocurrió un error inesperado.",
      );
    } finally {
      setGenerating(false);
    }
  }

  function handleOpenCourse(
    selectedCourse: AcademyCourse,
  ) {
    setCourse(selectedCourse);
    setDevelopmentContent("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleDeleteCourse(
    courseId: string,
  ) {
    const updatedCourses =
      deleteSavedAcademyCourse(
        courseId,
      );

    setSavedCourses(updatedCourses);

    if (course?.id === courseId) {
      setCourse(null);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl p-6 md:p-8">
      <header className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">
          VYRO Academy
        </p>

        <h1 className="mt-2 text-3xl font-bold md:text-4xl">
          Hola, {student.name || "estudiante"}
        </h1>

        <p className="mt-2 max-w-2xl text-gray-600">
          Consulta tu progreso, genera cursos con IA
          y continúa aprendiendo desde cualquier momento.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Nivel"
          value={formatLevel(student.level)}
          description="Nivel actual del estudiante"
        />

        <StatCard
          title="Progreso"
          value={`${student.progress}%`}
          description="Avance total de aprendizaje"
        />

        <StatCard
          title="Curso actual"
          value={currentCourse}
          description="Curso activo"
        />

        <StatCard
          title="Cursos guardados"
          value={String(savedCourses.length)}
          description="Cursos disponibles en este navegador"
        />
      </section>

      <XpCard />

      <RewardPanel />

      <RewardHistory />

      <PromptForm
        prompt={prompt}
        generating={generating}
        error={error}
        onPromptChange={setPrompt}
        onSubmit={handleGenerateCourse}
      />

      {developmentContent ? (
        <section className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-xl font-bold text-amber-900">
            Curso generado en modo de desarrollo
          </h2>

          <pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-7 text-amber-950">
            {developmentContent}
          </pre>
        </section>
      ) : null}

      {course ? (
        <CoursePreview course={course} />
      ) : null}

      <CourseHistory
        courses={savedCourses}
        onOpen={handleOpenCourse}
        onDelete={handleDeleteCourse}
      />

      <CertificateStatistics />

      <BadgeGallery />

      <CertificateHistory />

      <CertificateVerifier />

      <StudentInsights
        student={student}
      />
    </main>
  );
}
