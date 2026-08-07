"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  BattleCelebrationFXState,
} from "@/components/live/battle/celebration/types";

interface UseBattleCelebrationFXInput {
  visible: boolean;
  winnerName: string | null;
  isSeriesWinner: boolean;
}

export function useBattleCelebrationFX({
  visible,
  winnerName,
  isSeriesWinner,
}: UseBattleCelebrationFXInput) {
  const [
    state,
    setState,
  ] =
    useState<
      BattleCelebrationFXState
    >({
      visible: false,
      mode: "round",
      winnerName: null,
      celebrationId: null,
    });

  const sequenceRef =
    useRef(0);

  useEffect(() => {
    if (
      !visible
    ) {
      setState(
        (current) => ({
          ...current,
          visible:
            false,
        }),
      );

      return;
    }

    sequenceRef.current +=
      1;

    setState({
      visible:
        true,

      mode:
        isSeriesWinner
          ? "champion"
          : "round",

      winnerName,

      celebrationId:
        `celebration:${sequenceRef.current}`,
    });
  }, [
    isSeriesWinner,
    visible,
    winnerName,
  ]);

  return {
    celebrationFX:
      state,
  };
}
