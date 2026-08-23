"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getAllPlatformSettings,
  platformSettingKeys,
  type PlatformSettingKey,
  updatePlatformSetting,
} from "@/lib/admin/platform-settings";

import { supabase } from "@/lib/supabase";

type SettingsState = Record<
  PlatformSettingKey,
  number
>;

const initialSettings: SettingsState = {
  liveCommission: 20,
  marketplaceCommission: 10,
  referralBonus: 5,
  academyReward: 100,
  minimumWithdraw: 50,
};

const labels: Record<
  PlatformSettingKey,
  string
> = {
  liveCommission:
    "Comisión LIVE (%)",
  marketplaceCommission:
    "Comisión Marketplace (%)",
  referralBonus:
    "Bonificación por referido",
  academyReward:
    "Recompensa Academy",
  minimumWithdraw:
    "Retiro mínimo",
};

function isPlatformSettingKey(
  value: string,
): value is PlatformSettingKey {
  return (
    platformSettingKeys as readonly string[]
  ).includes(value);
}

export default function PlatformSettingsPanel() {
  const [
    settings,
    setSettings,
  ] = useState<SettingsState>(
    initialSettings,
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    savingKey,
    setSavingKey,
  ] = useState<PlatformSettingKey | null>(
    null,
  );

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const [
    message,
    setMessage,
  ] = useState<string | null>(null);

  const loadSettings =
    useCallback(async () => {
      setLoading(true);
      setError(null);

      const {
        data,
        error: loadError,
      } =
        await getAllPlatformSettings();

      if (loadError) {
        console.error(
          "VYRO platform settings load error:",
          loadError,
        );

        setError(
          "No fue posible cargar la configuración.",
        );
        setLoading(false);
        return;
      }

      const next: SettingsState = {
        ...initialSettings,
      };

      for (const row of data ?? []) {
        if (
          typeof row.key !== "string" ||
          !isPlatformSettingKey(row.key)
        ) {
          continue;
        }

        const numericValue =
          typeof row.value === "number"
            ? row.value
            : Number(row.value);

        if (Number.isFinite(numericValue)) {
          next[row.key] =
            numericValue;
        }
      }

      setSettings(next);
      setLoading(false);
    }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  async function updateValue(
    key: PlatformSettingKey,
    value: number,
  ) {
    if (!Number.isFinite(value)) {
      setError(
        "El valor debe ser un número válido.",
      );
      return;
    }

    setSavingKey(key);
    setError(null);
    setMessage(null);

    const {
      data: { user },
      error: authError,
    } =
      await supabase.auth.getUser();

    if (authError || !user) {
      setSavingKey(null);
      setError(
        "No fue posible verificar la sesión administrativa.",
      );
      return;
    }

    const {
      data,
      error: updateError,
    } =
      await updatePlatformSetting(
        key,
        value,
        user.id,
      );

    if (updateError || !data) {
      console.error(
        "VYRO platform setting update error:",
        updateError,
      );

      setSavingKey(null);
      setError(
        "No fue posible guardar la configuración.",
      );
      return;
    }

    const savedValue =
      typeof data.value === "number"
        ? data.value
        : Number(data.value);

    if (!Number.isFinite(savedValue)) {
      setSavingKey(null);
      setError(
        "Supabase devolvió un valor inválido.",
      );
      return;
    }

    setSettings(
      (current) => ({
        ...current,
        [key]: savedValue,
      }),
    );

    setSavingKey(null);
    setMessage(
      `${labels[key]} actualizado correctamente.`,
    );
  }

  return (
    <section className="rounded-3xl bg-slate-950 p-8 text-white shadow-2xl">
      <div>
        <h2 className="text-3xl font-bold">
          Configuración operativa
        </h2>

        <p className="mt-2 text-slate-400">
          Valores persistentes almacenados en Supabase.
        </p>
      </div>

      {loading && (
        <p className="mt-6 text-sm text-cyan-300">
          Cargando configuración...
        </p>
      )}

      {error && (
        <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {message && (
        <div className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-300">
          {message}
        </div>
      )}

      <div className="mt-8 grid gap-6">
        {platformSettingKeys.map(
          (key) => (
            <div
              key={key}
              className="rounded-xl bg-slate-900 p-5"
            >
              <label
                htmlFor={`platform-setting-${key}`}
                className="mb-2 block text-sm font-medium text-cyan-300"
              >
                {labels[key]}
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id={`platform-setting-${key}`}
                  type="number"
                  value={settings[key]}
                  disabled={
                    loading ||
                    savingKey !== null
                  }
                  onChange={(event) => {
                    const value =
                      Number(
                        event.target.value,
                      );

                    setSettings(
                      (current) => ({
                        ...current,
                        [key]: value,
                      }),
                    );
                  }}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 outline-none disabled:opacity-60"
                />

                <button
                  type="button"
                  disabled={
                    loading ||
                    savingKey !== null
                  }
                  onClick={() => {
                    void updateValue(
                      key,
                      settings[key],
                    );
                  }}
                  className="rounded-lg bg-cyan-500 px-5 py-3 font-bold text-black disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {savingKey === key
                    ? "Guardando..."
                    : "Guardar"}
                </button>
              </div>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
