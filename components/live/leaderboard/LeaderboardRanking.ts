import type {
  LiveLeaderboardEntry,
} from "./types";

export function sortLeaderboardEntries(
  entries: LiveLeaderboardEntry[],
): LiveLeaderboardEntry[] {
  return [...entries]
    .sort(
      (
        firstEntry,
        secondEntry,
      ) => {
        const amountDifference =
          secondEntry.totalAmount -
          firstEntry.totalAmount;

        if (amountDifference !== 0) {
          return amountDifference;
        }

        const energyDifference =
          secondEntry.totalEnergy -
          firstEntry.totalEnergy;

        if (energyDifference !== 0) {
          return energyDifference;
        }

        return (
          firstEntry.lastGiftAt -
          secondEntry.lastGiftAt
        );
      },
    )
    .map(
      (
        entry,
        index,
      ) => ({
        ...entry,
        rank: index + 1,
      }),
    );
}

export function limitLeaderboardEntries(
  entries: LiveLeaderboardEntry[],
  maximumEntries: number,
): LiveLeaderboardEntry[] {
  return entries.slice(
    0,
    Math.max(
      Math.floor(maximumEntries),
      0,
    ),
  );
}
