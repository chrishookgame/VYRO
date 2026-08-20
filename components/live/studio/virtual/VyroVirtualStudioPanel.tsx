"use client";

import { useState } from "react";

import {
  Aperture,
  Check,
  CircleOff,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Layers3,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import type {
  VyroVirtualBackgroundMode,
  VyroVirtualBackgroundPlayback,
  VyroVirtualBackgroundPreset,
  VyroVirtualEffect,
} from "./types";


interface VyroVirtualStudioPanelProps {
  backgroundMode: VyroVirtualBackgroundMode;
  backgroundPreset: VyroVirtualBackgroundPreset;
  backgroundPlayback: VyroVirtualBackgroundPlayback;
  effect: VyroVirtualEffect;
  segmentationReady?: boolean;
  disabled?: boolean;
  onBackgroundModeChange: (
    mode: VyroVirtualBackgroundMode,
  ) => void;
  onBackgroundPresetChange: (
    preset: VyroVirtualBackgroundPreset,
  ) => void;
  onBackgroundPlaybackChange: (
    playback: VyroVirtualBackgroundPlayback,
  ) => void;
  onEffectChange: (
    effect: VyroVirtualEffect,
  ) => void;
}

const effects: Array<{
  id: VyroVirtualEffect;
  label: string;
  description: string;
}> = [
  {
    id: "none",
    label: "Original",
    description: "Imagen natural de cámara.",
  },
  {
    id: "vyro-aura",
    label: "VYRO Aura",
    description: "Halo luminoso cyan y violeta premium.",
  },
  {
    id: "vyro-prism",
    label: "VYRO Prism",
    description: "Color prismático digital de nueva generación.",
  },
  {
    id: "vyro-dream",
    label: "VYRO Dream",
    description: "Luz suave y atmósfera elegante.",
  },
  {
    id: "vyro-night",
    label: "VYRO Night",
    description: "Profundidad nocturna con contraste premium.",
  },
];

const backgrounds: Array<{
  id: VyroVirtualBackgroundPreset;
  label: string;
  description: string;
  mode: VyroVirtualBackgroundMode;
  requiresSegmentation: boolean;
}> = [
  {
    id: "original",
    label: "Original",
    description: "Mantener el entorno real.",
    mode: "original",
    requiresSegmentation: false,
  },
  {
    id: "blur",
    label: "Desenfoque",
    description: "Fondo suavizado detrás del creador.",
    mode: "blur",
    requiresSegmentation: true,
  },
  {
    id: "vyro-neon",
    label: "VYRO Neon",
    description: "Escenario digital cyan de la marca.",
    mode: "image",
    requiresSegmentation: true,
  },
  {
    id: "vyro-arena",
    label: "VYRO Arena",
    description: "Escenario LIVE competitivo.",
    mode: "image",
    requiresSegmentation: true,
  },
  {
    id: "vyro-galaxy",
    label: "VYRO Galaxy",
    description: "Universo VYRO de alta energía.",
    mode: "image",
    requiresSegmentation: true,
  },
  {
    id: "vyro-smoke-stage",
    label: "VYRO Smoke Stage",
    description: "Escenario LIVE con humo y luces animadas.",
    mode: "image",
    requiresSegmentation: true,
  },
  {
    id: "vyro-laser-club",
    label: "VYRO Laser Club",
    description: "Club futurista con laser, pulsos y energia animada.",
    mode: "image",
    requiresSegmentation: true,
  },
  {
    id: "vyro-cyber-tunnel",
    label: "VYRO Cyber Tunnel",
    description: "Tunel cyber futurista con profundidad y energia VYRO.",
    mode: "image",
    requiresSegmentation: true,
  },
  {
    id: "vyro-fire-stage",
    label: "VYRO Fire Stage",
    description: "Escenario LIVE de fuego, brasas y energia.",
    mode: "image",
    requiresSegmentation: true,
  },
  {
    id: "vyro-aurora",
    label: "VYRO Aurora",
    description: "Aurora futurista con ondas luminosas en movimiento.",
    mode: "image",
    requiresSegmentation: true,
  },
  {
    id: "vyro-matrix",
    label: "VYRO Matrix",
    description: "Universo digital VYRO con lluvia de datos.",
    mode: "image",
    requiresSegmentation: true,
  },
  {
    id: "vyro-lightning",
    label: "VYRO Lightning",
    description: "Tormenta electrica futurista con rayos dinamicos.",
    mode: "image",
    requiresSegmentation: true,
  },
  {
    id: "vyro-luxury-gold",
    label: "VYRO Luxury Gold",
    description: "Estudio premium VYRO con atmosfera dorada.",
    mode: "image",
    requiresSegmentation: true,
  },
  {
    id: "vyro-ocean-view",
    label: "VYRO Ocean View",
    description: "Estudio panoramico VYRO frente al oceano.",
    mode: "image",
    requiresSegmentation: true,
  },
  {
    id: "vyro-jungle",
    label: "VYRO Jungle",
    description: "Entorno tropical futurista integrado con VYRO.",
    mode: "image",
    requiresSegmentation: true,
  },
  {
    id: "vyro-ice-studio",
    label: "VYRO Ice Studio",
    description: "Estudio helado futurista con energia cristalina.",
    mode: "image",
    requiresSegmentation: true,
  },
];

export function VyroVirtualStudioPanel({
  backgroundMode,
  backgroundPreset,
  backgroundPlayback,
  effect,
  segmentationReady = false,
  disabled = false,
  onBackgroundModeChange,
  onBackgroundPresetChange,
  onBackgroundPlaybackChange,
  onEffectChange,
}: VyroVirtualStudioPanelProps) {
  const [
    backgroundsOpen,
    setBackgroundsOpen,
  ] = useState(false);

  return (
    <section className="overflow-hidden rounded-3xl border border-cyan-400/20 bg-[#07111f] shadow-2xl">
      <div className="border-b border-white/10 bg-gradient-to-r from-cyan-400/10 via-transparent to-blue-500/10 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10">
            <WandSparkles
              size={20}
              className="text-cyan-300"
            />
          </div>

          <div>
            <h3 className="font-black text-white">
              VYRO Virtual Studio
            </h3>

            <p className="text-xs text-white/50">
              Fondos virtuales y efectos para tu cámara LIVE.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-7 p-5">
        <div>
          <button
            type="button"
            onClick={() =>
              setBackgroundsOpen((current) => !current)
            }
            className="mb-3 flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-left transition hover:border-cyan-300/40 hover:bg-cyan-300/5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-300">
                <ImageIcon size={17} />
              </div>

              <div>
                <div className="text-sm font-black uppercase tracking-[0.14em] text-white">
                  Fondos virtuales
                </div>

                <div className="mt-0.5 text-xs text-white/45">
                  {backgrounds.length} fondos
                </div>
              </div>
            </div>

            {backgroundsOpen ? (
              <ChevronUp
                size={18}
                className="text-cyan-300"
              />
            ) : (
              <ChevronDown
                size={18}
                className="text-white/45"
              />
            )}
          </button>

          {backgroundMode === "image" ? (
            <div className="mb-4 rounded-2xl border border-white/10 bg-black/20 p-3">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
                Movimiento del fondo
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() =>
                    onBackgroundPlaybackChange("static")
                  }
                  className={[
                    "rounded-xl border px-3 py-2 text-sm font-semibold transition",
                    backgroundPlayback === "static"
                      ? "border-cyan-300 bg-cyan-300/15 text-cyan-100"
                      : "border-white/10 bg-black/25 text-white/65 hover:border-cyan-300/40",
                    disabled
                      ? "cursor-not-allowed opacity-45"
                      : "",
                  ].join(" ")}
                >
                  Sin movimiento
                </button>

                <button
                  type="button"
                  disabled={disabled}
                  onClick={() =>
                    onBackgroundPlaybackChange("motion")
                  }
                  className={[
                    "rounded-xl border px-3 py-2 text-sm font-semibold transition",
                    backgroundPlayback === "motion"
                      ? "border-cyan-300 bg-cyan-300/15 text-cyan-100"
                      : "border-white/10 bg-black/25 text-white/65 hover:border-cyan-300/40",
                    disabled
                      ? "cursor-not-allowed opacity-45"
                      : "",
                  ].join(" ")}
                >
                  Con movimiento
                </button>
              </div>
            </div>
          ) : null}

          {backgroundsOpen ? (
            <div className="grid gap-3 sm:grid-cols-2">
            {backgrounds.map((background) => {
              const blocked =
                disabled ||
                (
                  background.requiresSegmentation &&
                  !segmentationReady
                );

              const selected =
                backgroundPreset === background.id &&
                backgroundMode === background.mode;

              return (
                <button
                  key={background.id}
                  type="button"
                  disabled={blocked}
                  onClick={() => {
                    onBackgroundPresetChange(
                      background.id,
                    );

                    onBackgroundModeChange(
                      background.mode,
                    );
                  }}
                  className={[
                    "relative min-h-24 overflow-hidden rounded-2xl border p-4 text-left transition",
                    selected
                      ? "border-cyan-300 bg-cyan-300/10"
                      : "border-white/10 bg-black/25 hover:border-cyan-300/40",
                    blocked
                      ? "cursor-not-allowed opacity-45"
                      : "",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-black text-white">
                        {background.label}
                      </div>

                      <div className="mt-1 text-xs leading-5 text-white/50">
                        {background.description}
                      </div>
                    </div>

                    {selected ? (
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-300 text-black">
                        <Check size={14} />
                      </div>
                    ) : (
                      <Layers3
                        size={17}
                        className="shrink-0 text-white/30"
                      />
                    )}
                  </div>

                  {background.requiresSegmentation &&
                  !segmentationReady ? (
                    <div className="mt-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-200/70">
                      <CircleOff size={12} />
                      Segmentación pendiente
                    </div>
                  ) : null}
                </button>
              );
            })}
            </div>
          ) : null}
        </div>

        <div className="h-px bg-white/10" />

        <div>
          <div className="mb-3 flex items-center gap-2">
            <Sparkles
              size={16}
              className="text-cyan-300"
            />

            <h4 className="text-sm font-black uppercase tracking-[0.14em] text-white">
              Efectos VYRO
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {effects.map((item) => {
              const selected =
                effect === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    onEffectChange(item.id);
                  }}
                  className={[
                    "relative rounded-2xl border p-4 text-left transition",
                    selected
                      ? "border-cyan-300 bg-cyan-300/10"
                      : "border-white/10 bg-black/25 hover:border-cyan-300/40",
                    disabled
                      ? "cursor-not-allowed opacity-45"
                      : "",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-black text-white">
                        {item.label}
                      </div>

                      <div className="mt-1 text-xs leading-5 text-white/50">
                        {item.description}
                      </div>
                    </div>

                    {selected ? (
                      <Check
                        size={16}
                        className="shrink-0 text-cyan-300"
                      />
                    ) : (
                      <Aperture
                        size={16}
                        className="shrink-0 text-white/30"
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/5 px-4 py-3 text-xs leading-5 text-white/55">
          Los efectos de imagen ya están soportados por el
          motor Canvas VYRO. Los fondos con separación de
          persona permanecerán bloqueados hasta activar
          segmentación real.
        </div>
      </div>
    </section>
  );
}
