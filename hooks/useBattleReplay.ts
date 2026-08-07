"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  BattleTimelineEvent,
} from "@/components/live/battle/timeline/types";

import type {
  BattleReplayMoment,
} from "@/components/live/battle/replay/types";

interface UseBattleReplayInput {
  events: BattleTimelineEvent[];
  limit?: number;
}

export function useBattleReplay({
  events,
  limit = 10,
}: UseBattleReplayInput) {
  const [
    activeMomentId,
    setActiveMomentId,
  ] = useState<string | null>(
    null,
  );

  const timeoutRef =
    useRef<
      ReturnType<
        typeof setTimeout
      > | null
    >(null);

  const moments =
    useMemo<
      BattleReplayMoment[]
    >(() => {
      return events
        .map(
          (
            event,
          ):
            BattleReplayMoment => ({
            id:
              `replay:${event.id}`,

            type:
              event.type ===
              "series_finished"
                ? "champion"
                : event.type ===
                    "round_draw"
                  ? "draw"
                  : event.type ===
                      "score_changed"
                    ? "victory"
                    : "round",

            title:
              event.title,

            description:
              event.description,

            createdAt:
              event.createdAt,

            durationMs:
              event.type ===
              "series_finished"
                ? 6500
                : event.type ===
                    "score_changed"
                  ? 5000
                  : 4000,
          }),
        )
        .slice(
          0,
          limit,
        );
    }, [
      events,
      limit,
    ]);

  const stopReplay =
    useCallback(() => {
      if (
        timeoutRef.current
      ) {
        clearTimeout(
          timeoutRef.current,
        );

        timeoutRef.current =
          null;
      }

      setActiveMomentId(
        null,
      );
    }, []);

  const playReplay =
    useCallback(
      (
        moment:
          BattleReplayMoment,
      ) => {
        if (
          timeoutRef.current
        ) {
          clearTimeout(
            timeoutRef.current,
          );
        }

        setActiveMomentId(
          moment.id,
        );

        timeoutRef.current =
          setTimeout(
            () => {
              setActiveMomentId(
                null,
              );

              timeoutRef.current =
                null;
            },
            moment.durationMs,
          );
      },
      [],
    );

  useEffect(() => {
    return () => {
      if (
        timeoutRef.current
      ) {
        clearTimeout(
          timeoutRef.current,
        );
      }
    };
  }, []);

  return {
    moments,
    activeMomentId,
    playReplay,
    stopReplay,
  };
}
