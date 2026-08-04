"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    if (!email || !password) {
      alert("Completa todos los campos.");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    console.log("LOGIN DATA:", data);

    const session = await supabase.auth.getSession();

    console.log("SESSION:", session);

    if (session.data.session) {
      alert("SESIÓN CREADA CORRECTAMENTE");
    } else {
      alert("NO SE CREÓ LA SESIÓN");
    }

    router.push("/feed");
  }

  return (
    <section className="w-full max-w-md rounded-3xl border border-cyan-500/20 bg-white/5 p-8 backdrop-blur-xl">
      <h2 className="mb-6 text-center text-3xl font-bold text-white">
        Login
      </h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4 w-full rounded-xl bg-black/30 p-4 text-white outline-none"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-6 w-full rounded-xl bg-black/30 p-4 text-white outline-none"
      />

      <button
        onClick={handleLogin}
        className="w-full rounded-xl bg-cyan-500 py-4 font-bold text-black"
      >
        Sign In
      </button>
    </section>
  );
}