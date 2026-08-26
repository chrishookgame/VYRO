"use client";

import {
  useEffect,
  useRef,
} from "react";

import type {
  GiftAnimationComponentProps,
} from "../types";

import {
  GlowEffect,
  ParticleSystem,
  ScreenFlash,
  SoundPlayer,
} from "../common";

import {
  getGiftAnimationConfiguration,
} from "../configs";

const DRAGON_VIDEO_SRC =
  "/visuals/gifts/dragon/vyro-dragon-cinematic.mp4";

export default function DragonAnimation({
  gift,
}: GiftAnimationComponentProps) {
  const videoRef =
    useRef<HTMLVideoElement>(null);

  const config =
    getGiftAnimationConfiguration(
      gift.animationKey,
    );

  useEffect(() => {
    const video =
      videoRef.current;

    if (!video) {
      return;
    }

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    try {
      video.currentTime = 0;
    } catch {
      // El metadata puede no estar listo todavía.
    }

    video.load();

    const startPlayback = () => {
      const currentVideo =
        videoRef.current;

      if (!currentVideo) {
        return;
      }

      void currentVideo
        .play()
        .catch(() => {
          // Chrome puede retrasar play()
          // hasta que el recurso esté listo.
        });
    };

    startPlayback();

    video.addEventListener(
      "loadeddata",
      startPlayback,
    );

    video.addEventListener(
      "canplay",
      startPlayback,
    );

    return () => {
      video.removeEventListener(
        "loadeddata",
        startPlayback,
      );

      video.removeEventListener(
        "canplay",
        startPlayback,
      );

      video.pause();
    };
  }, [gift.id]);

  return (
    <div className="pointer-events-none absolute inset-0 z-[100] overflow-hidden bg-black">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={DRAGON_VIDEO_SRC}
        autoPlay
        muted
        playsInline
        preload="auto"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-black/20" />

      <GlowEffect
        className={
          config.visual.glowClassName
        }
      />

      <ScreenFlash
        intensity={
          config.visual.flashIntensity ===
          "none"
            ? "soft"
            : config.visual.flashIntensity
        }
      />

      <ParticleSystem
        symbols={
          config.particles.symbols
        }
        count={
          config.particles.count
        }
      />

      <SoundPlayer
        soundKey={
          config.audio.soundKey
        }
        volume={
          config.audio.volume
        }
        pitch={
          config.audio.pitch
        }
      />

      <div className="absolute inset-x-0 bottom-0 z-30 flex justify-center px-6 pb-8 md:pb-12">
        <div className="max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.42em] text-cyan-200 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] md:text-sm">
            VYRO CINEMATIC GIFT
          </p>

          <h2 className="mt-3 text-4xl font-black text-white drop-shadow-[0_4px_24px_rgba(0,0,0,1)] md:text-7xl">
            {gift.name}
          </h2>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <span className="rounded-full border border-cyan-300/30 bg-black/55 px-5 py-2 text-xs font-black uppercase tracking-[0.22em] text-cyan-100 backdrop-blur-md">
              VYRO Dragon
            </span>

            <span className="rounded-full border border-fuchsia-300/30 bg-black/55 px-5 py-2 text-xs font-black uppercase tracking-[0.22em] text-fuchsia-100 backdrop-blur-md">
              Mythic
            </span>
          </div>

          <p className="mt-4 text-sm font-black text-cyan-100 drop-shadow-[0_2px_12px_rgba(0,0,0,1)] md:text-base">
            {gift.amount.toLocaleString("es-419")} VYRO · +{gift.energyAdded.toLocaleString("es-419")}
          </p>
        </div>
      </div>
    </div>
  );
}
