"use client";

import {
  BookOpen,
  Brain,
  GraduationCap,
  Plus,
  Sparkles,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { supabase } from "@/lib/supabase";
import Link from "next/link";

type AcademyCourse = {
  id: string;
  title: string;
  description: string | null;
  status: "draft" | "published" | "archived";
  price: number;
  progress: number;
  created_at: string;
};

export default function AcademyPage() {
  const [courses, setCourses] = useState<AcademyCourse[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const stats = useMemo(() => {
    const total = courses.length;
    const drafts = courses.filter(
      (course) => course.status === "draft",
    ).length;
    const published = courses.filter(
      (course) => course.status === "published",
    ).length;

    return {
      total,
      drafts,
      published,
    };
  }, [courses]);

  useEffect(() => {
    async function loadCourses() {
      setLoading(true);
      setError("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setLoading(false);
        setError("Debes iniciar sesión para ver VYRO Academy.");
        return;
      }

      const { data, error: coursesError } = await supabase
        .from("academy_courses")
        .select(
          "id, title, description, status, price, progress, created_at",
        )
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      if (coursesError) {
        console.error(
          "VYRO could not load academy courses:",
          coursesError,
        );

        setLoading(false);
        setError("No fue posible cargar tus cursos.");
        return;
      }

      setCourses((data ?? []) as AcademyCourse[]);
      setLoading(false);
    }

    void loadCourses();
  }, []);

  async function createCourse(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const cleanTitle = title.trim();
    const cleanDescription = description.trim();
    const numericPrice = Number(price);

    if (!cleanTitle) {
      setError("Escribe un nombre para el curso.");
      return;
    }

    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      setError("Escribe un precio válido.");
      return;
    }

    setCreating(true);
    setError("");
    setMessage("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setCreating(false);
      setError("Debes iniciar sesión para crear un curso.");
      return;
    }

    const { data, error: insertError } = await supabase
      .from("academy_courses")
      .insert({
        user_id: user.id,
        title: cleanTitle,
        description: cleanDescription || null,
        status: "draft",
        price: numericPrice,
        progress: 0,
      })
      .select(
        "id, title, description, status, price, progress, created_at",
      )
      .single();

    setCreating(false);

    if (insertError) {
      console.error(
        "VYRO academy course creation failed:",
        insertError,
      );

      setError("No fue posible crear el curso.");
      return;
    }

    setCourses((currentCourses) => [
      data as AcademyCourse,
      ...currentCourses,
    ]);

    setTitle("");
    setDescription("");
    setPrice("0");
    setMessage("Curso creado correctamente en VYRO Academy.");
  }

  return (
    <main className="min-h-screen bg-[#05070A] px-6 py-8 text-white md:px-8 xl:px-10">
      <div className="mx-auto max-w-[1500px] space-y-8">
        <section className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-[#0B1220] to-[#101827] p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-500/10">
                <GraduationCap
                  className="text-cyan-400"
                  size={34}
                />
              </div>

              <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-400">
                  VYRO Academy
                </p>

                <h1 className="mt-2 text-4xl font-black">
                  Construye conocimiento que crece
                </h1>

                <p className="mt-3 max-w-3xl text-gray-400">
                  Crea cursos, organiza contenido y prepara experiencias
                  educativas conectadas con todo el ecosistema VYRO.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-5 py-4">
              <div className="flex items-center gap-2 text-cyan-300">
                <Brain size={20} />
                <span className="font-bold">
                  AI Teacher activo
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-300">
                Genera módulos y lecciones con VYRO AI y guárdalos directamente en tu curso.
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              label: "Cursos totales",
              value: stats.total,
              icon: BookOpen,
            },
            {
              label: "Borradores",
              value: stats.drafts,
              icon: Sparkles,
            },
            {
              label: "Publicados",
              value: stats.published,
              icon: Users,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.label}
                className="rounded-2xl border border-white/10 bg-[#0B1220] p-5"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10">
                  <Icon className="text-cyan-400" size={22} />
                </div>

                <p className="mt-4 text-sm text-gray-400">
                  {item.label}
                </p>

                <p className="mt-2 text-3xl font-black">
                  {item.value}
                </p>
              </article>
            );
          })}
        </section>

        <section className="grid grid-cols-1 gap-8 xl:grid-cols-[0.8fr_1.2fr]">
          <form
            onSubmit={createCourse}
            className="rounded-3xl border border-white/10 bg-[#0B1220] p-6"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10">
                <Plus className="text-cyan-400" size={24} />
              </div>

              <div>
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
                  Crear curso
                </p>

                <h2 className="mt-1 text-2xl font-black">
                  Nuevo curso
                </h2>
              </div>
            </div>

            <div className="mt-7 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-300">
                  Título
                </span>

                <input
                  type="text"
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                  }}
                  placeholder="Ejemplo: Inglés para principiantes"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition placeholder:text-gray-500 focus:border-cyan-400"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-300">
                  Descripción
                </span>

                <textarea
                  value={description}
                  onChange={(event) => {
                    setDescription(event.target.value);
                  }}
                  rows={5}
                  placeholder="Explica qué aprenderán los estudiantes."
                  className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition placeholder:text-gray-500 focus:border-cyan-400"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-300">
                  Precio
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(event) => {
                    setPrice(event.target.value);
                  }}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-cyan-400"
                />
              </label>

              {error ? (
                <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </p>
              ) : null}

              {message ? (
                <p className="rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-200">
                  {message}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={creating}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 py-4 font-black text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Plus size={20} />
                {creating ? "Creando..." : "Crear curso"}
              </button>
            </div>
          </form>

          <section className="rounded-3xl border border-white/10 bg-[#080C12] p-6">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
                Mis cursos
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Academy Library
              </h2>
            </div>

            {loading ? (
              <p className="mt-8 text-gray-400">
                Cargando cursos...
              </p>
            ) : courses.length === 0 ? (
              <div className="mt-7 rounded-2xl border border-dashed border-cyan-500/20 p-10 text-center">
                <GraduationCap
                  className="mx-auto text-cyan-400"
                  size={42}
                />

                <h3 className="mt-4 text-xl font-black">
                  Todavía no tienes cursos
                </h3>

                <p className="mt-2 text-gray-400">
                  Crea el primero y empieza a construir tu academia.
                </p>
              </div>
            ) : (
              <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2">
                {courses.map((course) => (
                  <article
                    key={course.id}
                    className="rounded-2xl border border-white/10 bg-[#0B1220] p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10">
                        <BookOpen
                          className="text-cyan-400"
                          size={22}
                        />
                      </div>

                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase text-gray-300">
                        {course.status}
                      </span>
                    </div>

                    <h3 className="mt-5 text-xl font-black">
                      {course.title}
                    </h3>

                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-400">
                      {course.description || "Curso sin descripción."}
                    </p>

                    <div className="mt-5 flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        Progreso
                      </span>

                      <span className="font-bold text-cyan-300">
                        {course.progress}%
                      </span>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-cyan-400"
                        style={{
                          width: `${course.progress}%`,
                        }}
                      />
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                      <span className="font-bold text-white">
                        ${Number(course.price).toFixed(2)}
                      </span>

                      <Link
                      href={`/academy/courses/${course.id}`}
                     className="rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm font-bold text-cyan-300 transition hover:bg-cyan-500/20"
                     >
                     Abrir curso
                     </Link>
  
                      
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}