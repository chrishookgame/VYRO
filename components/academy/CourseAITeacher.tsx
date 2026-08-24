"use client";

import { useState } from "react";

import AcademyAIGenerator, {
  type GeneratedAcademyCourse,
} from "@/components/academy/AcademyAIGenerator";
import { parseGeneratedAcademyCourse } from "@/lib/ai/parsers";
import { generateAcademyCourse } from "@/lib/ai/services/generateAcademyCourse";
import { saveGeneratedCourse } from "@/lib/ai/services/saveAcademyCourse";

type CourseAITeacherProps = {
  courseId: string;
  courseTitle: string;
};

export default function CourseAITeacher({
  courseId,
  courseTitle,
}: CourseAITeacherProps) {
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  const [generatedCourse, setGeneratedCourse] =
    useState<GeneratedAcademyCourse | null>(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleGenerate(prompt: string) {
    if (generating || saving) {
      return;
    }

    setGenerating(true);
    setGeneratedCourse(null);
    setError("");
    setMessage("");

    try {
      const response = await generateAcademyCourse({
        prompt,
        courseTitle,
        moduleCount: 4,
        lessonsPerModule: 3,
      });

      if (!response.success) {
        setError(
          response.error ||
            "VYRO Academy AI no pudo generar el curso.",
        );
        return;
      }

      try {
        const parsedCourse =
          parseGeneratedAcademyCourse(
            response.content,
          );

        setGeneratedCourse(parsedCourse);
        setMessage(
          "Curso generado correctamente. Revisa la vista previa antes de guardarlo.",
        );
      } catch (parsingError) {
        throw parsingError;
      }
    } catch (generationError) {
      console.error(
        "VYRO Academy course generation failed:",
        generationError,
      );

      setError(
        generationError instanceof Error
          ? generationError.message
          : "Ocurrió un error al generar el curso.",
      );
    } finally {
      setGenerating(false);
    }
  }

  async function handleSave(
    course: GeneratedAcademyCourse,
  ) {
    if (saving || generating) {
      return;
    }

    setSaving(true);
    setError("");
    setMessage("Guardando módulos y lecciones...");

    try {
      await saveGeneratedCourse({
        courseId,
        course,
      });

      setMessage(
        "✅ Curso, módulos y lecciones guardados correctamente en Supabase.",
      );
    } catch (savingError) {
      console.error(
        "VYRO Academy generated course saving failed:",
        savingError,
      );

      setMessage("");

      setError(
        savingError instanceof Error
          ? savingError.message
          : "No fue posible guardar el curso generado.",
      );
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    if (generating || saving) {
      return;
    }

    setGeneratedCourse(null);
    setError("");
    setMessage("");
  }

  return (
    <AcademyAIGenerator
      generating={generating}
      saving={saving}
      generatedCourse={generatedCourse}
      error={error}
      message={message}
      onGenerate={(prompt) => {
        void handleGenerate(prompt);
      }}
      onSave={(course) => {
        void handleSave(course);
      }}
      onReset={handleReset}
    />
  );
}