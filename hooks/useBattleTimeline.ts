"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  BattleSeriesState,
  LiveBattleState,
} from "@/components/live/battle";

import type {
  BattleTimelineEvent,
} from "@/components/live/battle/timeline/types";

interface UseBattleTimelineInput {
  series: BattleSeriesState | null;
  battle: LiveBattleState | null;
}

interface PreviousTimelineSnapshot {
  seriesId: string;
  status: string;
  leftWins: number;
  rightWins: number;
  draws: number;
  currentPosition: number;
}

export function useBattleTimeline({
  series,
  battle,
}: UseBattleTimelineInput) {
  const [
    events,
    setEvents,
  ] =
    useState<
      BattleTimelineEvent[]
    >([]);

  const previousRef =
    useRef<
      PreviousTimelineSnapshot | null
    >(null);

  const seenEventsRef =
    useRef<Set<string>>(
      new Set(),
    );

  useEffect(() => {
    if (
      !series ||
      !battle
    ) {
      return;
    }

    const previous =
      previousRef.current;

    const snapshot:
      PreviousTimelineSnapshot = {
        seriesId:
          series.id,
        status:
          series.status,
        leftWins:
          series.leftWins,
        rightWins:
          series.rightWins,
        draws:
          series.draws,
        currentPosition:
          series.currentPosition,
      };

    previousRef.current =
      snapshot;

    const pushEvent = (
      event: BattleTimelineEvent,
    ) => {
      if (
        seenEventsRef.current.has(
          event.id,
        )
      ) {
        return;
      }

      seenEventsRef.current.add(
        event.id,
      );

      setEvents(
        (current) =>
          [
            event,
            ...current,
          ].slice(
            0,
            30,
          ),
      );
    };

    if (
      !previous ||
      previous.seriesId !==
        series.id
    ) {
      pushEvent({
        id:
          `${series.id}:round:${series.currentPosition}:started`,
        type:
          "round_started",
        title:
          `Ronda ${series.currentPosition}`,
        description:
          `${battle.left.creatorName} vs ${battle.right.creatorName}`,
        createdAt:
          Date.now(),
      });

      return;
    }

    if (
      series.currentPosition >
      previous.currentPosition
    ) {
      pushEvent({
        id:
          `${series.id}:round:${series.currentPosition}:started`,
        type:
          "round_started",
        title:
          `Ronda ${series.currentPosition}`,
        description:
          `${battle.left.creatorName} vs ${battle.right.creatorName}`,
        createdAt:
          Date.now(),
      });
    }

    if (
      series.leftWins >
      previous.leftWins
    ) {
      pushEvent({
        id:
          `${series.id}:score:${series.leftWins}:${series.rightWins}:${series.draws}`,
        type:
          "score_changed",
        title:
          `${battle.left.creatorName} gana la ronda`,
        description:
          `Marcador ${series.leftWins} - ${series.rightWins}`,
        createdAt:
          Date.now(),
      });
    }

    if (
      series.rightWins >
      previous.rightWins
    ) {
      pushEvent({
        id:
          `${series.id}:score:${series.leftWins}:${series.rightWins}:${series.draws}`,
        type:
          "score_changed",
        title:
          `${battle.right.creatorName} gana la ronda`,
        description:
          `Marcador ${series.leftWins} - ${series.rightWins}`,
        createdAt:
          Date.now(),
      });
    }

    if (
      series.draws >
      previous.draws
    ) {
      pushEvent({
        id:
          `${series.id}:draw:${series.draws}`,
        type:
          "round_draw",
        title:
          "Ronda empatada",
        description:
          `Empates acumulados: ${series.draws}`,
        createdAt:
          Date.now(),
      });
    }

    if (
      series.status ===
        "finished" &&
      previous.status !==
        "finished"
    ) {
      const winnerName =
        series.winnerId ===
        battle.left.creatorId
          ? battle.left.creatorName
          : series.winnerId ===
              battle.right.creatorId
            ? battle.right.creatorName
            : null;

      pushEvent({
        id:
          `${series.id}:finished`,
        type:
          "series_finished",
        title:
          winnerName
            ? `${winnerName} es campeón`
            : "Battle Series finalizada",
        description:
          winnerName
            ? `Resultado final ${series.leftWins} - ${series.rightWins}`
            : "La serie terminó sin campeón único.",
        createdAt:
          Date.now(),
      });
    }
  }, [
    battle,
    series,
  ]);

  return {
    events,
  };
}
