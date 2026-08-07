"use client";

import {
  useMemo,
} from "react";

import type {
  BattleAnalyticsSnapshot,
} from "@/components/live/battle/analytics/types";

import type {
  BattleDirectorState,
} from "@/components/live/battle/director/types";

import type {
  BattleMVPResult,
} from "@/components/live/battle/mvp/types";

import type {
  BattleRecapData,
} from "@/components/live/battle/recap/types";

import type {
  BattleStoryData,
} from "@/components/live/battle/story/types";

interface UseBattleStoryInput {
  analytics: BattleAnalyticsSnapshot;
  director: BattleDirectorState;
  recap: BattleRecapData;
  mvp: BattleMVPResult;
}

export function useBattleStory({
  analytics,
  director,
  recap,
  mvp,
}: UseBattleStoryInput) {
  const story =
    useMemo<
      BattleStoryData
    >(() => {
      const winnerName =
        recap.winnerName ??
        "ningún creador";

      const headline =
        recap.winnerName
          ? `${winnerName} escribe una nueva historia en VYRO`
          : "Una Battle Series sin dueño absoluto";

      const introduction =
        recap.winnerName
          ? `La Battle Series terminó con ${winnerName} al frente del marcador ${recap.finalScore}.`
          : `La Battle Series terminó con un marcador ${recap.finalScore} y sin un campeón único.`;

      const openingText =
        analytics.completedRounds > 0
          ? `La serie avanzó durante ${analytics.completedRounds} ronda${analytics.completedRounds === 1 ? "" : "s"} completada${analytics.completedRounds === 1 ? "" : "s"}, con ${analytics.draws} empate${analytics.draws === 1 ? "" : "s"}.`
          : "La historia todavía está comenzando y VYRO sigue recopilando señales de la batalla.";

      const momentumText =
        director.intensity >= 75
          ? `El AI Battle Director detectó una intensidad de ${director.intensity}%, señal de una batalla de alta presión.`
          : `El AI Battle Director registró una intensidad de ${director.intensity}% durante el desarrollo de la serie.`;

      const mvpText =
        mvp.winner
          ? `${mvp.winner.creatorName} terminó como MVP provisional con un score de ${mvp.winner.score} y una confianza de ${mvp.confidence}%.`
          : "El sistema MVP mantiene la evaluación abierta porque el rendimiento sigue equilibrado.";

      const highlightText =
        recap.highlights.length > 0
          ? `VYRO identificó ${recap.highlights.length} momento${recap.highlights.length === 1 ? "" : "s"} destacado${recap.highlights.length === 1 ? "" : "s"} dentro de la serie.`
          : "Todavía no hay suficientes highlights para construir una narrativa más profunda.";

      const ending =
        recap.winnerName
          ? `${winnerName} cierra esta Battle Series como protagonista, mientras VYRO conserva el Timeline, Highlights, Replay, Analytics y Recap de la historia.`
          : "La historia queda abierta y preparada para futuras batallas dentro de VYRO.";

      return {
        headline,
        introduction,
        paragraphs: [
          {
            id:
              "story:opening",
            title:
              "El comienzo",
            text:
              openingText,
          },
          {
            id:
              "story:momentum",
            title:
              "El momentum",
            text:
              momentumText,
          },
          {
            id:
              "story:mvp",
            title:
              "El protagonista",
            text:
              mvpText,
          },
          {
            id:
              "story:highlights",
            title:
              "Los momentos clave",
            text:
              highlightText,
          },
        ],
        ending,
      };
    }, [
      analytics,
      director,
      mvp,
      recap,
    ]);

  return {
    story,
  };
}
