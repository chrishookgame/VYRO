"use client";

import {
  useMemo,
} from "react";

import {
  createAutomaticMilestoneEvents,
} from "@/components/live/competitiveorchestrator/events/AutomaticMilestoneEvents";

import {
  selectPrimaryCompetitiveEvent,
} from "@/components/live/competitiveorchestrator/priority/CompetitivePriorityResolver";

import {
  resolveCelebrationTrigger,
} from "@/components/live/competitiveorchestrator/celebrations/CelebrationTriggerResolver";

import {
  bridgeCompetitiveEvents,
} from "@/components/live/competitiveorchestrator/bridge/CompetitiveEventBridge";

import type {
  CompetitiveOrchestratorPlayer,
} from "@/components/live/competitiveorchestrator/types/CompetitiveOrchestratorTypes";

export function useCompetitiveOrchestrator(
  players: CompetitiveOrchestratorPlayer[],
  now: number,
) {
  return useMemo(
    () => {
      const orchestratorEvents =
        players.flatMap(
          player =>
            createAutomaticMilestoneEvents(
              player,
              now,
            ),
        );

      const primaryEvent =
        selectPrimaryCompetitiveEvent(
          orchestratorEvents,
        );

      const celebration =
        resolveCelebrationTrigger(
          primaryEvent,
        );

      const liveEvents =
        bridgeCompetitiveEvents(
          orchestratorEvents,
        );

      return {
        orchestratorEvents,
        liveEvents,
        primaryEvent,
        celebration,
      };
    },
    [
      players,
      now,
    ],
  );
}
