"use client";

import {
  useMemo,
} from "react";

import type {
  BattleAnalyticsSnapshot,
} from "@/components/live/battle/analytics/types";

import type {
  BattleDirectorInsight,
  BattleDirectorState,
} from "@/components/live/battle/director/types";

interface UseBattleAIDirectorInput {
  analytics: BattleAnalyticsSnapshot;
  phase:
    | "idle"
    | "winner"
    | "versus"
    | "countdown"
    | "battle"
    | "finished";
  winnerName: string | null;
  isSeriesWinner: boolean;
}

function clamp(
  value: number,
): number {
  return Math.min(
    100,
    Math.max(
      0,
      Math.round(value),
    ),
  );
}

export function useBattleAIDirector({
  analytics,
  phase,
  winnerName,
  isSeriesWinner,
}: UseBattleAIDirectorInput) {
  const director =
    useMemo<
      BattleDirectorState
    >(() => {
      const insights:
        BattleDirectorInsight[] = [];

      const scoreDifference =
        Math.abs(
          analytics.leftWins -
            analytics.rightWins,
        );

      const completedRounds =
        analytics.completedRounds;

      const closeBattle =
        completedRounds >= 2 &&
        scoreDifference <= 1;

      const dominance =
        completedRounds >= 2 &&
        scoreDifference >= 2;

      const drawPressure =
        analytics.drawRate >= 35;

      const nearFinish =
        analytics.completionPercent >=
        70;

      let intensity =
        20;

      intensity +=
        analytics.completionPercent *
        0.35;

      intensity +=
        analytics.decisiveRate *
        0.2;

      if (closeBattle) {
        intensity += 20;
      }

      if (nearFinish) {
        intensity += 15;
      }

      if (
        phase === "countdown" ||
        phase === "winner"
      ) {
        intensity += 10;
      }

      if (
        phase === "finished"
      ) {
        intensity = 100;
      }

      const now =
        Date.now();

      if (closeBattle) {
        insights.push({
          id:
            "director:close-battle",
          type:
            "close_battle",
          priority:
            nearFinish
              ? "critical"
              : "high",
          title:
            "Battle muy cerrada",
          message:
            `La diferencia es de solo ${scoreDifference} ronda${scoreDifference === 1 ? "" : "s"}. La tensión está subiendo.`,
          createdAt:
            now,
        });
      }

      if (dominance) {
        const leader =
          analytics.leftWins >
          analytics.rightWins
            ? "lado izquierdo"
            : "lado derecho";

        insights.push({
          id:
            "director:dominance",
          type:
            "dominance",
          priority:
            "high",
          title:
            "Dominio detectado",
          message:
            `El ${leader} mantiene una ventaja de ${scoreDifference} rondas.`,
          createdAt:
            now,
        });
      }

      if (drawPressure) {
        insights.push({
          id:
            "director:draw-pressure",
          type:
            "draw_pressure",
          priority:
            "medium",
          title:
            "Alta presión de empate",
          message:
            `${analytics.drawRate}% de las rondas completadas han terminado empatadas.`,
          createdAt:
            now,
        });
      }

      if (
        nearFinish &&
        phase !== "finished"
      ) {
        insights.push({
          id:
            "director:final-stretch",
          type:
            "momentum",
          priority:
            "high",
          title:
            "Entramos en la recta final",
          message:
            `La Battle Series está al ${analytics.completionPercent}% de progreso.`,
          createdAt:
            now,
        });
      }

      if (
        phase === "winner" &&
        winnerName
      ) {
        insights.push({
          id:
            isSeriesWinner
              ? "director:champion"
              : "director:round-winner",
          type:
            isSeriesWinner
              ? "champion"
              : "momentum",
          priority:
            isSeriesWinner
              ? "critical"
              : "high",
          title:
            isSeriesWinner
              ? "Campeón detectado"
              : "Cambio de momentum",
          message:
            isSeriesWinner
              ? `${winnerName} conquista la Battle Series.`
              : `${winnerName} acaba de ganar la ronda.`,
          createdAt:
            now,
        });
      }

      if (
        phase === "finished"
      ) {
        insights.unshift({
          id:
            "director:finished",
          type:
            "champion",
          priority:
            "critical",
          title:
            "Battle Series finalizada",
          message:
            winnerName
              ? `${winnerName} termina como campeón de la serie.`
              : "La serie ha llegado a su conclusión.",
          createdAt:
            now,
        });
      }

      if (
        insights.length === 0 &&
        completedRounds === 0
      ) {
        insights.push({
          id:
            "director:watching",
          type:
            "status",
          priority:
            "low",
          title:
            "Director observando",
          message:
            "VYRO está analizando el desarrollo de la Battle Series.",
          createdAt:
            now,
        });
      }

      const mode:
        BattleDirectorState["mode"] =
          phase === "finished"
            ? "finale"
            : intensity >= 75
              ? "intense"
              : phase === "idle"
                ? "idle"
                : "watching";

      const headline =
        mode === "finale"
          ? "La Battle Series ha terminado"
          : mode === "intense"
            ? "La batalla está en máxima intensidad"
            : mode === "watching"
              ? "AI Director analizando en tiempo real"
              : "AI Director en espera";

      const summary =
        mode === "finale"
          ? "El director ha completado el análisis de esta Battle Series."
          : closeBattle
            ? "La diferencia entre ambos lados es mínima. Cada ronda puede cambiar el resultado."
            : dominance
              ? "Existe una ventaja clara, pero el desarrollo de las próximas rondas todavía puede cambiar la narrativa."
              : "VYRO analiza progreso, marcador, empates y momentum para detectar los momentos más importantes.";

      return {
        mode,
        headline,
        summary,
        intensity:
          clamp(intensity),
        insights:
          insights.slice(
            0,
            6,
          ),
      };
    }, [
      analytics,
      isSeriesWinner,
      phase,
      winnerName,
    ]);

  return {
    director,
  };
}
