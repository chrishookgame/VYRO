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

export const defaultLeaderboardConfiguration: LiveLeaderboardConfiguration = {
  maximumEntries: 100,
  maximumProcessedEvents: 1000,
};

export function createLeaderboardState(
  roomId: string,
): LiveLeaderboardState {
  return {
    roomId,
    entries: {},
    processedEventIds: [],
    updatedAt: Date.now(),
  };
}

function createLeaderboardEntry(
  event: LiveLeaderboardGiftEvent,
): LiveLeaderboardEntry {
  return {
    userId: event.senderId,
    displayName:
      event.senderName ??
      "Usuario VYRO",
    avatarUrl:
      event.senderAvatarUrl,
    totalAmount:
      Math.max(event.amount, 0),
    totalEnergy:
      Math.max(event.energy, 0),
    giftCount: 1,
    lastGiftAt:
      event.createdAt,
    rank: 0,
  };
}

function updateLeaderboardEntry(
  currentEntry: LiveLeaderboardEntry,
  event: LiveLeaderboardGiftEvent,
): LiveLeaderboardEntry {
  return {
    ...currentEntry,
    displayName:
      event.senderName ??
      currentEntry.displayName,
    avatarUrl:
      event.senderAvatarUrl ??
      currentEntry.avatarUrl,
    totalAmount:
      currentEntry.totalAmount +
      Math.max(event.amount, 0),
    totalEnergy:
      currentEntry.totalEnergy +
      Math.max(event.energy, 0),
    giftCount:
      currentEntry.giftCount + 1,
    lastGiftAt:
      event.createdAt,
  };
}

export function applyGiftEventToLeaderboard(
  state: LiveLeaderboardState,
  event: LiveLeaderboardGiftEvent,
  configuration: LiveLeaderboardConfiguration =
    defaultLeaderboardConfiguration,
): LiveLeaderboardState {
  if (
    state.roomId !== event.roomId ||
    state.processedEventIds.includes(
      event.id,
    )
  ) {
    return state;
  }

  const currentEntry =
    state.entries[event.senderId];

  const nextEntry =
    currentEntry
      ? updateLeaderboardEntry(
          currentEntry,
          event,
        )
      : createLeaderboardEntry(
          event,
        );

  const rankedEntries =
    limitLeaderboardEntries(
      sortLeaderboardEntries([
        ...Object.values(
          state.entries,
        ).filter(
          (entry) =>
            entry.userId !==
            event.senderId,
        ),
        nextEntry,
      ]),
      configuration.maximumEntries,
    );

  return {
    roomId: state.roomId,
    entries:
      Object.fromEntries(
        rankedEntries.map(
          (entry) => [
            entry.userId,
            entry,
          ],
        ),
      ),
    processedEventIds: [
      ...state.processedEventIds,
      event.id,
    ].slice(
      -Math.max(
        configuration.maximumProcessedEvents,
        1,
      ),
    ),
    updatedAt: Date.now(),
  };
}
