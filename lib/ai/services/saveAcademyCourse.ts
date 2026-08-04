import { supabase } from "@/lib/supabase";

type GeneratedLesson = {
  title: string;
  description: string;
  content?: string;
  durationMinutes?: number;
};

type GeneratedModule = {
  title: string;
  description: string;
  lessons: GeneratedLesson[];
};

type GeneratedCourse = {
  title: string;
  description: string;
  modules: GeneratedModule[];
};

type SaveGeneratedCourseInput = {
  courseId: string;
  course: GeneratedCourse;
};

export async function saveGeneratedCourse({
  courseId,
  course,
}: SaveGeneratedCourseInput) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error(
      "Debes iniciar sesión para guardar el curso generado.",
    );
  }

  const { data: existingCourse, error: courseError } =
    await supabase
      .from("academy_courses")
      .select("id")
      .eq("id", courseId)
      .eq("user_id", user.id)
      .maybeSingle();

  if (courseError) {
    console.error(
      "VYRO could not verify academy course:",
      courseError,
    );

    throw new Error(
      "No fue posible verificar el curso seleccionado.",
    );
  }

  if (!existingCourse) {
    throw new Error(
      "El curso no existe o no tienes permiso para modificarlo.",
    );
  }

  for (const [
    moduleIndex,
    academyModule,
  ] of course.modules.entries()) {
    const cleanModuleTitle =
      academyModule.title.trim();

    if (!cleanModuleTitle) {
      throw new Error(
        `El módulo ${moduleIndex + 1} no tiene un título válido.`,
      );
    }

    const { data: createdModule, error: moduleError } =
      await supabase
        .from("academy_modules")
        .insert({
          course_id: courseId,
          user_id: user.id,
          title: cleanModuleTitle,
          description:
            academyModule.description.trim() || null,
          position: moduleIndex + 1,
          progress: 0,
        })
        .select("id")
        .single();

    if (moduleError || !createdModule) {
      console.error(
        "VYRO academy module saving failed:",
        moduleError,
      );

      throw new Error(
        `No fue posible guardar el módulo: ${cleanModuleTitle}`,
      );
    }

    if (academyModule.lessons.length === 0) {
      continue;
    }

    const lessonsToInsert =
      academyModule.lessons.map(
        (lesson, lessonIndex) => {
          const cleanLessonTitle =
            lesson.title.trim();

          if (!cleanLessonTitle) {
            throw new Error(
              `La lección ${lessonIndex + 1} del módulo "${cleanModuleTitle}" no tiene un título válido.`,
            );
          }

          const durationMinutes = Number(
            lesson.durationMinutes ?? 0,
          );

          return {
            module_id: createdModule.id,
            course_id: courseId,
            user_id: user.id,
            title: cleanLessonTitle,
            description:
              lesson.description.trim() || null,
            content:
              lesson.content?.trim() || null,
            video_url: null,
            duration_minutes:
              Number.isFinite(durationMinutes) &&
              durationMinutes >= 0
                ? Math.round(durationMinutes)
                : 0,
            position: lessonIndex + 1,
            status: "draft",
          };
        },
      );

    const { error: lessonsError } = await supabase
      .from("academy_lessons")
      .insert(lessonsToInsert);

    if (lessonsError) {
      console.error(
        "VYRO academy lessons saving failed:",
        lessonsError,
      );

      throw new Error(
        `El módulo "${cleanModuleTitle}" se guardó, pero sus lecciones no pudieron guardarse.`,
      );
    }
  }

  return {
    success: true,
    modulesCreated: course.modules.length,
    lessonsCreated: course.modules.reduce(
      (total, academyModule) =>
        total + academyModule.lessons.length,
      0,
    ),
  };
}