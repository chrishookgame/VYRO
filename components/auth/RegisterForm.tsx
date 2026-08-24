"use client";

import { getErrorMessage } from "@/lib/core";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  clearReferralCode,
  getReferralCode,
  registerReferralByCode,
} from "@/lib/referral";

import { supabase } from "@/lib/supabase";

import {
  Button,
  Input,
} from "@/components/ui";

export default function RegisterForm() {
  const router = useRouter();

  const requestedReturnTo =
    typeof window !== "undefined"
      ? new URLSearchParams(
          window.location.search,
        ).get("returnTo")
      : null;

  const returnTo =
    requestedReturnTo?.startsWith("/") &&
    !requestedReturnTo.startsWith("//")
      ? requestedReturnTo
      : "/dashboard";

  const loginReturnTo =
    requestedReturnTo?.startsWith("/") &&
    !requestedReturnTo.startsWith("//")
      ? `/login?returnTo=${encodeURIComponent(
          requestedReturnTo,
        )}`
      : "/login";

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [registering, setRegistering] =
    useState(false);

  const [message, setMessage] =
    useState("");

  async function handleRegister() {
    const cleanUsername =
      username.trim();

    const cleanEmail =
      email.trim().toLowerCase();

    if (
      !cleanUsername ||
      !cleanEmail ||
      !password
    ) {
      setMessage(
        "Completa todos los campos.",
      );

      return;
    }

    if (password.length < 6) {
      setMessage(
        "La contraseña debe tener al menos 6 caracteres.",
      );

      return;
    }

    setRegistering(true);
    setMessage("");

    try {
      const sponsorReferralCode =
        getReferralCode();

      const {
        data,
        error,
      } =
        await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              username:
                cleanUsername,

              sponsor_referral_code:
                sponsorReferralCode,
            },
          },
        });

      if (error) {
        setMessage(
          error.message,
        );

        return;
      }

      if (!data.user) {
        setMessage(
          "No fue posible crear el usuario.",
        );

        return;
      }

      /*
       * El trigger de Supabase crea automáticamente:
       * - profiles
       * - wallets
       * - notifications
       */

      if (sponsorReferralCode) {
        const referralResult =
          await registerReferralByCode(
            data.user.id,
            sponsorReferralCode,
          );

        if (
          !referralResult.success
        ) {
          console.error(
            "VYRO referral error:",
            referralResult.error,
          );
        } else {
          clearReferralCode();
        }
      }

      if (!data.session) {
        setMessage(
          "Cuenta creada. Revisa tu correo para confirmar tu cuenta.",
        );

        setTimeout(() => {
          router.replace(loginReturnTo);
        }, 2500);

        return;
      }

      setMessage(
        "Cuenta creada correctamente.",
      );

      router.replace(returnTo);
      router.refresh();
    } catch (error) {
      console.error(
        "VYRO register error:",
        getErrorMessage(error),
      );

      setMessage(
        "Ocurrió un error inesperado durante el registro.",
      );
    } finally {
      setRegistering(false);
    }
  }

  return (
    <section className="w-full max-w-md rounded-3xl border border-cyan-500/20 bg-white/5 p-8 backdrop-blur-xl">
      <h2 className="mb-2 text-center text-3xl font-bold text-white">
        Crear cuenta
      </h2>

      <p className="mb-6 text-center text-sm text-slate-400">
        Únete al ecosistema VYRO
      </p>

      <div className="space-y-4">
        <Input
          type="text"
          label="Nombre de usuario"
          placeholder="Tu nombre en VYRO"
          value={username}
          onChange={(event) =>
            setUsername(
              event.target.value,
            )
          }
          disabled={registering}
          autoComplete="username"
        />

        <Input
          type="email"
          label="Correo electrónico"
          placeholder="correo@ejemplo.com"
          value={email}
          onChange={(event) =>
            setEmail(
              event.target.value,
            )
          }
          disabled={registering}
          autoComplete="email"
        />

        <Input
          type="password"
          label="Contraseña"
          placeholder="Mínimo 6 caracteres"
          value={password}
          onChange={(event) =>
            setPassword(
              event.target.value,
            )
          }
          disabled={registering}
          autoComplete="new-password"
        />

        {message && (
          <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4 text-sm text-cyan-200">
            {message}
          </div>
        )}

        <Button
          type="button"
          loading={registering}
          disabled={registering}
          onClick={handleRegister}
          className="w-full"
        >
          Crear cuenta
        </Button>
      </div>
    </section>
  );
}
