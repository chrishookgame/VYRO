"use client";

import {
  useEffect,
} from "react";

interface SoundPlayerProps {
  soundKey: string;
  enabled?: boolean;
  volume?: number;
  pitch?: number;
}

interface VyroAudioLayer {
  src: string;
  delayMs: number;
  volumeScale: number;
}

const audioLayersBySoundKey: Record<
  string,
  VyroAudioLayer[]
> = {
  vyro_dragon: [
    {
      src: "/audio/gifts/dragon/dragon-wings.mp3",
      delayMs: 0,
      volumeScale: 0.72,
    },
    {
      src: "/audio/gifts/dragon/dragon-roar.mp3",
      delayMs: 1400,
      volumeScale: 1,
    },
    {
      src: "/audio/gifts/dragon/dragon-fire.mp3",
      delayMs: 3200,
      volumeScale: 0.82,
    },
  ],
};

export default function SoundPlayer({
  soundKey,
  enabled = true,
  volume = 1,
  pitch = 1,
}: SoundPlayerProps) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const layers =
      audioLayersBySoundKey[
        soundKey
      ];

    if (!layers) {
      return;
    }

    const timers: number[] = [];
    const audioElements:
      HTMLAudioElement[] = [];

    for (const layer of layers) {
      const timer =
        window.setTimeout(
          () => {
            const audio =
              new Audio(layer.src);

            audio.preload = "auto";

            audio.volume =
              Math.max(
                0,
                Math.min(
                  1,
                  volume *
                    layer.volumeScale,
                ),
              );

            audio.playbackRate =
              Math.max(
                0.5,
                Math.min(
                  2,
                  pitch,
                ),
              );

            if (
              "preservesPitch" in
              audio
            ) {
              audio.preservesPitch =
                false;
            }

            audioElements.push(
              audio,
            );

            void audio
              .play()
              .catch(() => {
                // El navegador puede
                // bloquear audio antes
                // de una interaccion.
              });
          },
          layer.delayMs,
        );

      timers.push(timer);
    }

    return () => {
      for (const timer of timers) {
        window.clearTimeout(timer);
      }

      for (
        const audio
        of audioElements
      ) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [
    enabled,
    pitch,
    soundKey,
    volume,
  ]);

  if (!enabled) {
    return null;
  }

  return (
    <span
      className="sr-only"
      data-vyro-sound-key={
        soundKey
      }
    >
      Sonido VYRO preparado
    </span>
  );
}
