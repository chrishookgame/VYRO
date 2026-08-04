"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  createReferralProfile,
  getReferralCount,
  getUserReferrals,
  type ReferralProfile,
} from "@/lib/referral";
import { supabase } from "@/lib/supabase";

export function ReferralPanel() {
  const [
    profile,
    setProfile,
  ] = useState<ReferralProfile | null>(
    null,
  );

  const [
    totalReferrals,
    setTotalReferrals,
  ] = useState(0);

  const [
    registeredReferrals,
    setRegisteredReferrals,
  ] = useState(0);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    copied,
    setCopied,
  ] = useState(false);

  useEffect(() => {
    async function loadReferralData() {
      setLoading(true);
      setError("");

      try {
        const {
          data: userData,
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          setError(
            "No fue posible cargar el usuario.",
          );
          return;
        }

        const user =
          userData.user;

        if (!user) {
          setError(
            "Inicia sesión para consultar tus referidos.",
          );
          return;
        }

        setProfile(
          createReferralProfile(
            user.id,
            window.location.origin,
          ),
        );

        const [
          referralCountResult,
          referralsResult,
        ] = await Promise.all([
          getReferralCount(user.id),
          getUserReferrals(user.id),
        ]);

        if (referralCountResult.error) {
          setError(
            referralCountResult.error.message,
          );
          return;
        }

        if (referralsResult.error) {
          setError(
            referralsResult.error.message,
          );
          return;
        }

        setTotalReferrals(
          referralCountResult.count ?? 0,
        );

        const registeredCount =
          (referralsResult.data ?? [])
            .filter(
              (referral) =>
                referral.status ===
                "registered",
            )
            .length;

        setRegisteredReferrals(
          registeredCount,
        );
      } catch (loadError) {
        console.error(
          "VYRO referral statistics error:",
          loadError,
        );

        setError(
          "Ocurrió un error al cargar las estadísticas.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadReferralData();
  }, []);

  async function handleCopy() {
    if (!profile) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        profile.referralLink,
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (copyError) {
      console.error(
        "VYRO referral copy error:",
        copyError,
      );

      window.alert(
        "No fue posible copiar el enlace.",
      );
    }
  }

  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">
        Programa de Referidos
      </p>

      <h2 className="mt-2 text-2xl font-bold">
        Comparte VYRO
      </h2>

      <p className="mt-2 text-sm text-gray-600">
        Invita personas al ecosistema VYRO
        usando tu enlace personal.
      </p>

      {error ? (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mt-6 space-y-4">
        <div>
          <p className="text-xs uppercase text-gray-500">
            Código
          </p>

          <p className="mt-1 font-mono text-lg font-bold">
            {profile?.referralCode ??
              (loading
                ? "Preparando..."
                : "No disponible")}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-gray-500">
            Enlace
          </p>

          <p className="mt-1 break-all text-sm text-violet-700">
            {profile?.referralLink ??
              (loading
                ? "Generando enlace personal..."
                : "No disponible")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 rounded-xl bg-gray-50 p-4 text-center sm:grid-cols-3">
          <div>
            <p className="text-xs text-gray-500">
              Referidos
            </p>

            <p className="text-xl font-bold">
              {loading
                ? "..."
                : totalReferrals}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Registrados
            </p>

            <p className="text-xl font-bold">
              {loading
                ? "..."
                : registeredReferrals}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Ganancias
            </p>

            <p className="text-xl font-bold text-green-600">
              $0.00
            </p>

            <p className="mt-1 text-[11px] text-gray-400">
              Wallet pendiente
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          disabled={!profile || loading}
          className="w-full rounded-xl bg-violet-600 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {copied
            ? "Enlace copiado"
            : "Copiar enlace"}
        </button>
      </div>
    </section>
  );
}
