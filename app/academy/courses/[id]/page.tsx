"use client";

import { LoaderCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import CourseAITeacher from "@/components/academy/CourseAITeacher";
import CourseHeader from "@/components/academy/CourseHeader";
import CourseLessons from "@/components/academy/CourseLessons";
import CourseModules from "@/components/academy/CourseModules";
import CourseOverview from "@/components/academy/CourseOverview";
import { supabase } from "@/lib/supabase";

type AcademyCourse = {
  id: string;
  title: string;
  description: string | null;
  status: "draft" | "published" | "archived";
  price: number;
  progress: number;
  created_at: string;
};

export default function AcademyCourseWorkspacePage() {
  const params = useParams<{ id: string }>();
  const courseId = params.id;

  const [course, setCourse] = useState<AcademyCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCourse() {
      setLoading(true);
      setError("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setLoading(false);
        setError("Debes iniciar sesión para abrir este curso.");
        return;
      }

      const { data, error: courseError } = await supabase
        .from("academy_courses")
        .select(
          "id, title, description, status, price, progress, created_at",
        )
        .eq("id", courseId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (courseError) {
        console.error(
          "VYRO could not load academy course:",
          courseError,
        );

        setLoading(false);
        setError("No fue posible cargar el curso.");
        return;
      }

      if (!data) {
        setLoading(false);
        setError("El curso no existe o no tienes acceso.");
        return;
      }

      setCourse(data as AcademyCourse);
      setLoading(false);
    }

    void loadCourse();
  }, [courseId]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#05070A] px-6 text-white">
        <div className="text-center">
          <LoaderCircle
            className="mx-auto animate-spin text-cyan-400"
            size={42}
          />
          <p className="mt-4 font-bold">
            Cargando Course Workspace...
          </p>
        </div>
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#05070A] px-6 text-white">
        <section className="w-full max-w-xl rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center">
          <h1 className="text-2xl font-black text-red-100">
            No fue posible abrir el curso
          </h1>

          <p className="mt-4 text-red-200">
            {error}
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#05070A] px-6 py-8 text-white md:px-8 xl:px-10">
      <div className="mx-auto max-w-[1500px] space-y-8">

        <CourseHeader
          title={course.title}
          status={course.status}
          progress={course.progress}
          price={course.price}
        />

        <CourseOverview
          description={course.description}
          status={course.status}
          price={course.price}
          createdAt={course.created_at}
        />

        <CourseAITeacher
          courseId={course.id}
          courseTitle={course.title}
        />

        <CourseModules
          courseId={course.id}
        />

        <CourseLessons
          courseId={course.id}
        />

      </div>
    </main>
  );
}