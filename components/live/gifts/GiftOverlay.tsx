"use client";

import {
  useEffect,
} from "react";

import {
  useGiftComboEngine,
  useLiveStageDirector,
  type LiveGiftOverlayItem,
} from "@/hooks";

import {
  ComboEffects,
  ComboOverlay,
} from "./combo";

import {
  AnimationOrchestrator,
} from "./orchestrator";

interface GiftOverlayProps {
  gift: LiveGiftOverlayItem | null;
  queuedGifts?: number;
}

function playVyroGiftSound(
  gift: LiveGiftOverlayItem,
) {
  const AudioContextClass =
    window.AudioContext ||
    (
      window as typeof window & {
        webkitAudioContext?: typeof AudioContext;
      }
    ).webkitAudioContext;

  if (!AudioContextClass) {
    return;
  }

  try {
    const context =
      new AudioContextClass();

    const oscillator =
      context.createOscillator();

    const gain =
      context.createGain();

    const rarityFrequency = {
      common: 440,
      rare: 520,
      epic: 660,
      legendary: 780,
      mythic: 920,
    }[gift.rarity];

    const keyVariation =
      gift.animationKey
        .split("")
        .reduce(
          (total, character) =>
            total +
            character.charCodeAt(0),
          0,
        ) % 120;

    oscillator.type =
      gift.rarity === "mythic"
        ? "sawtooth"
        : gift.rarity === "legendary"
          ? "triangle"
          : "sine";

    oscillator.frequency.setValueAtTime(
      rarityFrequency + keyVariation,
      context.currentTime,
    );

    oscillator.frequency.exponentialRampToValueAtTime(
      rarityFrequency * 1.5,
      context.currentTime + 0.55,
    );

    gain.gain.setValueAtTime(
      0.0001,
      context.currentTime,
    );

    gain.gain.exponentialRampToValueAtTime(
      0.12,
      context.currentTime + 0.04,
    );

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      context.currentTime + 0.75,
    );

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();
    oscillator.stop(
      context.currentTime + 0.8,
    );

    oscillator.addEventListener(
      "ended",
      () => {
        void context.close();
      },
    );
  } catch {
    // Algunos navegadores bloquean audio
    // antes de la primera interacción.
  }
}

export default function GiftOverlay({
  gift,
}: GiftOverlayProps) {
  const {
    activeCombo,
  } = useGiftComboEngine(gift);

  const {
    activeGift,
    activeCombo: stageCombo,
  } = useLiveStageDirector(
    gift,
    activeCombo,
  );

  useEffect(() => {
    if (!activeGift) {
      return;
    }

    playVyroGiftSound(
      activeGift,
    );
  }, [activeGift]);

  return (
    <>
      <AnimationOrchestrator
        gift={activeGift}
      />

      <ComboOverlay
        combo={stageCombo}
      />

      {stageCombo ? (
        <ComboEffects
          tier={stageCombo.tier}
        />
      ) : null}
    </>
  );
}
