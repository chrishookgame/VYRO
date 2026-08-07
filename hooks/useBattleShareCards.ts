"use client";

import {
  useMemo,
} from "react";

import type {
  BattleMVPResult,
} from "@/components/live/battle/mvp/types";

import type {
  BattleRecapData,
} from "@/components/live/battle/recap/types";

import type {
  BattleStoryData,
} from "@/components/live/battle/story/types";

import type {
  BattleShareCardData,
} from "@/components/live/battle/cards/types";

interface UseBattleShareCardsInput {
  recap: BattleRecapData;
  story: BattleStoryData;
  mvp: BattleMVPResult;
}

export function useBattleShareCards({
  recap,
  story,
  mvp,
}: UseBattleShareCardsInput) {
  const shareCard =
    useMemo<
      BattleShareCardData
    >(() => {
      const winnerName =
        recap.winnerName ??
        "Sin campeón";

      const mvpName =
        mvp.winner?.creatorName ??
        recap.mvp ??
        "Por determinar";

      const highlights =
        recap.highlights
          .slice(
            0,
            4,
          )
          .map(
            (highlight) =>
              highlight.title,
          );

      return {
        title:
          story.headline,

        subtitle:
          story.introduction,

        winnerName,

        finalScore:
          recap.finalScore,

        mvpName,

        highlights,
      };
    }, [
      mvp,
      recap,
      story,
    ]);

  return {
    shareCard,
  };
}
