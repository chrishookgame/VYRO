"use client";

import { useState } from "react";

import {
  getPlatformSettings,
  updatePlatformSettings,
} from "@/lib/admin";

export default function PlatformSettingsPanel() {

  const [settings, setSettings] =
    useState(
      getPlatformSettings(),
    );

  function updateValue(
    key: keyof typeof settings,
    value: number,
  ) {

    const updated =
      updatePlatformSettings({
        [key]: value,
      });

    setSettings(updated);

  }

  return (

    <section className="rounded-3xl bg-slate-950 p-8 text-white shadow-2xl">

      <h1 className="text-3xl font-bold">
        Configuración Global
      </h1>

      <p className="mt-2 text-slate-400">
        Admin Maestro
      </p>

      <div className="mt-8 grid gap-6">

        {Object.entries(settings).map(
          ([key, value]) => (

            <div
              key={key}
              className="rounded-xl bg-slate-900 p-5"
            >

              <label className="mb-2 block text-sm capitalize text-cyan-300">
                {key}
              </label>

              <input
                type="number"
                value={value}
                onChange={(event) =>
                  updateValue(
                    key as keyof typeof settings,
                    Number(
                      event.target.value,
                    ),
                  )
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 outline-none"
              />

            </div>

          ),
        )}

      </div>

    </section>

  );

}
