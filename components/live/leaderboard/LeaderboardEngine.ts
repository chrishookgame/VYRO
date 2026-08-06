import {
  applyGiftEventToLeaderboard,
  createLeaderboardState,
  defaultLeaderboardConfiguration,
} from "./LeaderboardManager";

import {
  limitLeaderboardEntries,
  sortLeaderboardEntries,
} from "./LeaderboardRanking";

import type {
  LiveLeaderboardConfiguration,
  LiveLeaderboardEntry,
  LiveLeaderboardGiftEvent,
  LiveLeaderboardState,
} from "./types";

export interface LiveLeaderboardEngine {
  state: LiveLeaderboardState;
  configuration: LiveLeaderboardConfiguration;
}

export function createLiveLeaderboardEngine(
  roomId: string,
  configuration: LiveLeaderboardConfiguration =
    defaultLeaderboardConfiguration,
): LiveLeaderboardEngine {
  return {
    state: createLeaderboardState(
      roomId,
    ),
    configuration,
  };
}

export function processLeaderboardGiftEvent(
  engine: LiveLeaderboardEngine,
  event: LiveLeaderboardGiftEvent,
): LiveLeaderboardEngine {
  return {
    ...engine,
    state:
      applyGiftEventToLeaderboard(
        engine.state,
        event,
        engine.configuration,
      ),
  };
}

export function getLeaderboardEntries(
  engine: LiveLeaderboardEngine,
): LiveLeaderboardEntry[] {
  return limitLeaderboardEntries(
    sortLeaderboardEntries(
      Object.values(
        engine.state.entries,
      ),
    ),
    engine.configuration.maximumEntries,
  );
}

export function getTopLeaderboardEntries(
  engine: LiveLeaderboardEngine,
  limit = 10,
): LiveLeaderboardEntry[] {
  return getLeaderboardEntries(
    engine,
  ).slice(
    0,
    Math.max(
      Math.floor(limit),
      0,
    ),
  );
}

export function resetLiveLeaderboard(
  engine: LiveLeaderboardEngine,
): LiveLeaderboardEngine {
  return {
    ...engine,
    state:
      createLeaderboardState(
        engine.state.roomId,
      ),
  };
}
