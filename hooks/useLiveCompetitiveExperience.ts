"use client";

import {
  useMemo,
} from "react";

import {
  createLiveCompetitiveState,
} from "@/components/live/competitiveexperience/engine/LiveCompetitiveEngine";

import {
  calculateCompetitiveHype,
} from "@/components/live/competitiveexperience/hype/CompetitiveHypeEngine";

import {
  resolveCompetitiveLiveStatus,
} from "@/components/live/competitiveexperience/status/CompetitiveLiveStatus";

import {
  selectCompetitiveSpotlight,
} from "@/components/live/competitiveexperience/spotlight/CompetitiveSpotlight";

import {
  createCompetitiveEventFeed,
} from "@/components/live/competitiveexperience/feed/CompetitiveEventFeed";

import type {
  LiveCompetitiveEvent,
  LiveCompetitivePlayer,
} from "@/components/live/competitiveexperience/types/LiveCompetitiveTypes";

export function useLiveCompetitiveExperience(
  players: LiveCompetitivePlayer[],
  events: LiveCompetitiveEvent[],
  active: boolean,
) {
  return useMemo(
    () => {
      const hype =
        calculateCompetitiveHype(
          players,
        );

      const status =
        resolveCompetitiveLiveStatus(
          hype,
        );

      const spotlight =
        selectCompetitiveSpotlight(
          players,
        );

      const feed =
        createCompetitiveEventFeed(
          events,
          10,
        );

      return {
        state:
          createLiveCompetitiveState(
            players,
            events,
            hype,
            active,
          ),

        status,
        spotlight,
        feed,
      };
    },
    [
      players,
      events,
      active,
    ],
  );
}
