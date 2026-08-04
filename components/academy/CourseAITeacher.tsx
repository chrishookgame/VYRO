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

function buildDevelopmentCourse(
  prompt: string,
  courseTitle: string,
): GeneratedAcademyCourse {
  return {
    title: courseTitle,
    description:
      `Curso generado en modo de desarrollo a partir de la solicitud: ${prompt}`,
    modules: [
      {
        title: "Módulo 1: Fundamentos",
        description:
          "Introducción, objetivos y conceptos fundamentales del curso.",
        lessons: [
          {
            title: "Introducción al curso",
            description:
              "Presentación general del tema y los resultados de aprendizaje.",
            content:
              "En esta lección el estudiante conocerá el propósito del curso, su estructura y los principales objetivos.",
            durationMinutes: 20,
          },
          {
            title: "Conceptos fundamentales",
            description:
              "Explicación de las ideas principales necesarias para avanzar.",
            content:
              "Esta lección desarrolla los conceptos esenciales mediante explicaciones claras y ejemplos iniciales.",
            durationMinutes: 30,
          },
          {
            title: "Actividad de comprobación",
            description:
              "Ejercicio para comprobar la comprensión de los fundamentos.",
            content:
              "El estudiante deberá responder preguntas breves y aplicar los conceptos aprendidos.",
            durationMinutes: 20,
          },
        ],
      },
      {
        title: "Módulo 2: Aplicación práctica",
        description:
          "Uso práctico de los conocimientos mediante ejemplos y actividades.",
        lessons: [
          {
            title: "Ejemplo guiado",
            description:
              "Aplicación paso a paso de los conceptos principales.",
            content:
              "VYRO presenta un ejemplo completo y explica cada una de las decisiones realizadas durante el proceso.",
            durationMinutes: 35,
          },
          {
            title: "Actividad práctica",
            description:
              "Ejercicio individual para aplicar lo aprendido.",
            content:
              "El estudiante desarrollará una actividad práctica utilizando la metodología presentada en el ejemplo guiado.",
            durationMinutes: 45,
          },
          {
            title: "Análisis de resultados",
            description:
              "Revisión y evaluación de la actividad realizada.",
            content:
              "Esta lección permite comparar resultados, identificar oportunidades de mejora y reforzar el aprendizaje.",
            durationMinutes: 25,
          },
        ],
      },
      {
        title: "Módulo 3: Proyecto guiado",
        description:
          "Desarrollo progresivo de un proyecto relacionado con el curso.",
        lessons: [
          {
            title: "Planificación del proyecto",
            description:
              "Definición del objetivo, los recursos y las etapas del proyecto.",
            content:
              "El estudiante preparará un plan de trabajo con objetivos claros, actividades y criterios de éxito.",
            durationMinutes: 30,
          },
          {
            title: "Desarrollo del proyecto",
            description:
              "Ejecución del proyecto utilizando los conocimientos adquiridos.",
            content:
              "El estudiante desarrollará el proyecto siguiendo las etapas definidas y documentando sus decisiones.",
            durationMinutes: 60,
          },
          {
            title: "Revisión y mejora",
            description:
              "Evaluación del proyecto y aplicación de mejoras.",
            content:
              "Se revisarán los resultados del proyecto y se identificarán cambios para mejorar su calidad.",
            durationMinutes: 30,
          },
        ],
      },
      {
        title: "Módulo 4: Evaluación final",
        description:
          "Comprobación de conocimientos y cierre del proceso educativo.",
        lessons: [
          {
            title: "Repaso general",
            description:
              "Resumen de los conocimientos desarrollados durante el curso.",
            content:
              "Esta lección repasa los conceptos principales, las actividades y las conclusiones del curso.",
            durationMinutes: 25,
          },
          {
            title: "Evaluación final",
            description:
              "Evaluación para comprobar el dominio de los contenidos.",
            content:
              "El estudiante completará una evaluación compuesta por preguntas conceptuales y ejercicios prácticos.",
            durationMinutes: 40,
          },
          {
            title: "Próximos pasos",
            description:
              "Recomendaciones para continuar desarrollando conocimientos.",
            content:
              "VYRO presenta recursos, actividades y rutas de aprendizaje para continuar avanzando después del curso.",
            durationMinutes: 20,
          },
        ],
      },
    ],
  };
}

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
        const isDevelopmentResponse =
          response.content
            .toLowerCase()
            .includes("modo de desarrollo");

        if (!isDevelopmentResponse) {
          throw parsingError;
        }

        setGeneratedCourse(
          buildDevelopmentCourse(
            prompt,
            courseTitle,
          ),
        );

        setMessage(
          "Curso generado en modo de desarrollo. Puedes revisar y probar el guardado en Supabase.",
        );
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