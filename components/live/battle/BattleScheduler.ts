export type BattleSeriesStatus =
  | "scheduled"
  | "waiting"
  | "active"
  | "intermission"
  | "finished"
  | "cancelled";

export interface BattleSeriesConfig {
  totalBattles: number;
  battleDurationSeconds: number;
  breakDurationSeconds: number;
  autoStartNext: boolean;
}

export interface BattleSeriesRound {
  position: number;
  battleId: string | null;
  status:
    | "pending"
    | "active"
    | "finished"
    | "cancelled";
  winnerId: string | null;
  startedAt: string | null;
  finishedAt: string | null;
}

export interface BattleSeriesState {
  id: string;
  roomId: string;
  status: BattleSeriesStatus;
  config: BattleSeriesConfig;
  currentPosition: number;
  leftWins: number;
  rightWins: number;
  draws: number;
  rounds: BattleSeriesRound[];
  nextBattleAt: string | null;
  winnerId: string | null;
}

function normalizePositiveInteger(
  value: number,
  fallback: number,
): number {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(
    1,
    Math.floor(value),
  );
}

function normalizeNonNegativeInteger(
  value: number,
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(
    0,
    Math.floor(value),
  );
}

export class BattleScheduler {
  createSeries(
    id: string,
    roomId: string,
    config: BattleSeriesConfig,
  ): BattleSeriesState {
    const safeTotalBattles =
      normalizePositiveInteger(
        config.totalBattles,
        1,
      );

    const safeConfig: BattleSeriesConfig = {
      totalBattles: safeTotalBattles,
      battleDurationSeconds:
        normalizePositiveInteger(
          config.battleDurationSeconds,
          300,
        ),
      breakDurationSeconds:
        normalizeNonNegativeInteger(
          config.breakDurationSeconds,
        ),
      autoStartNext:
        Boolean(config.autoStartNext),
    };

    const rounds: BattleSeriesRound[] =
      Array.from(
        {
          length:
            safeConfig.totalBattles,
        },
        (_, index) => ({
          position: index + 1,
          battleId: null,
          status: "pending",
          winnerId: null,
          startedAt: null,
          finishedAt: null,
        }),
      );

    return {
      id,
      roomId,
      status: "scheduled",
      config: safeConfig,
      currentPosition: 0,
      leftWins: 0,
      rightWins: 0,
      draws: 0,
      rounds,
      nextBattleAt: null,
      winnerId: null,
    };
  }

  startSeries(
    series: BattleSeriesState,
    now = new Date(),
  ): BattleSeriesState {
    if (
      series.status !== "scheduled" &&
      series.status !== "waiting"
    ) {
      return series;
    }

    return {
      ...series,
      status: "active",
      currentPosition: 1,
      nextBattleAt:
        now.toISOString(),
    };
  }

  startCurrentRound(
    series: BattleSeriesState,
    battleId: string,
    now = new Date(),
  ): BattleSeriesState {
    if (
      series.status !== "active" ||
      series.currentPosition <= 0
    ) {
      return series;
    }

    const rounds =
      series.rounds.map((round) =>
        round.position ===
        series.currentPosition
          ? {
              ...round,
              battleId,
              status:
                "active" as const,
              startedAt:
                now.toISOString(),
            }
          : round,
      );

    return {
      ...series,
      rounds,
      nextBattleAt: null,
    };
  }

  finishCurrentRound(
    series: BattleSeriesState,
    winnerId: string | null,
    leftCreatorId: string,
    rightCreatorId: string,
    now = new Date(),
  ): BattleSeriesState {
    if (
      series.status !== "active" ||
      series.currentPosition <= 0
    ) {
      return series;
    }

    let leftWins =
      series.leftWins;

    let rightWins =
      series.rightWins;

    let draws =
      series.draws;

    if (
      winnerId === leftCreatorId
    ) {
      leftWins += 1;
    } else if (
      winnerId === rightCreatorId
    ) {
      rightWins += 1;
    } else {
      draws += 1;
    }

    const rounds =
      series.rounds.map((round) =>
        round.position ===
        series.currentPosition
          ? {
              ...round,
              status:
                "finished" as const,
              winnerId,
              finishedAt:
                now.toISOString(),
            }
          : round,
      );

    const isLastRound =
      series.currentPosition >=
      series.config.totalBattles;

    if (isLastRound) {
      let seriesWinnerId:
        string | null = null;

      if (leftWins > rightWins) {
        seriesWinnerId =
          leftCreatorId;
      }

      if (rightWins > leftWins) {
        seriesWinnerId =
          rightCreatorId;
      }

      return {
        ...series,
        status: "finished",
        leftWins,
        rightWins,
        draws,
        rounds,
        nextBattleAt: null,
        winnerId: seriesWinnerId,
      };
    }

    const nextBattleAt =
      new Date(
        now.getTime() +
          series.config
            .breakDurationSeconds *
            1000,
      ).toISOString();

    return {
      ...series,
      status: "intermission",
      leftWins,
      rightWins,
      draws,
      rounds,
      nextBattleAt,
    };
  }

  advanceToNextRound(
    series: BattleSeriesState,
    now = new Date(),
  ): BattleSeriesState {
    if (
      series.status !==
        "intermission" ||
      !series.nextBattleAt
    ) {
      return series;
    }

    const nextBattleTime =
      new Date(
        series.nextBattleAt,
      ).getTime();

    if (
      Number.isNaN(
        nextBattleTime,
      ) ||
      now.getTime() <
        nextBattleTime
    ) {
      return series;
    }

    return {
      ...series,
      status: "active",
      currentPosition:
        series.currentPosition + 1,
      nextBattleAt:
        now.toISOString(),
    };
  }

  cancelSeries(
    series: BattleSeriesState,
  ): BattleSeriesState {
    if (
      series.status === "finished" ||
      series.status === "cancelled"
    ) {
      return series;
    }

    return {
      ...series,
      status: "cancelled",
      nextBattleAt: null,
    };
  }
}

export const battleScheduler =
  new BattleScheduler();
