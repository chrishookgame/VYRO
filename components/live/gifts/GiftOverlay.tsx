import { useAIGiftIntelligence } from "@/hooks/useAIGiftIntelligence";
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
    // antes de la primera interacciÃ³n.
  }
}

export default function GiftOverlay({
  gift,
}: GiftOverlayProps) {
  const {
    activeCombo,
  } = useGiftComboEngine(gift);

  const giftIntelligence =
    useAIGiftIntelligence(
      gift,
      queuedGifts ?? 0,
    );

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
      {giftIntelligence ? (
        <div
          data-vyro-gift-intelligence="true"
          data-tier={
            giftIntelligence
              .multiplier.tier
          }
          data-prediction={
            giftIntelligence
              .prediction.prediction
          }
          style={{
            position:"absolute",
            top:"18px",
            left:"50%",
            transform:
              "translateX(-50%)",
            zIndex:75,
            pointerEvents:"none",
            opacity:
              giftIntelligence
                .excitement.score >= 55
                ? 1
                : 0,
            transition:
              "opacity 220ms ease",
          }}
        >
          <div
            style={{
              borderRadius:"999px",
              padding:"8px 14px",
              background:
                "rgba(8,10,18,0.88)",
              border:
                "1px solid rgba(255,255,255,0.16)",
              fontSize:"12px",
              fontWeight:900,
              letterSpacing:"0.08em",
              boxShadow:
                "0 12px 40px rgba(0,0,0,0.4)",
            }}
          >
            VYRO {
              giftIntelligence
                .multiplier.tier
            } ×{
              giftIntelligence
                .multiplier.multiplier
            }
          </div>
        </div>
      ) : null}
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
