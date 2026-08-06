import type {
  LiveBattleState,
} from "./LiveBattleEngine";

import {
  battleScheduler,
  type BattleSeriesState,
} from "./BattleScheduler";

import {
  battleStateManager,
} from "./BattleStateManager";

export type AutoBattleDirectorAction =
  | "none"
  | "series_started"
  | "round_started"
  | "round_finished"
  | "intermission"
  | "next_round_ready"
  | "series_finished"
  | "series_cancelled";

export interface AutoBattleDirectorResult {
  series: BattleSeriesState;
  battle: LiveBattleState | null;
  action: AutoBattleDirectorAction;
}

export interface StartBattleRoundInput {
  battle: LiveBattleState;
  durationSeconds?: number;
  now?: Date;
}

export interface FinishBattleRoundInput {
  series: BattleSeriesState;
  battle: LiveBattleState;
  now?: Date;
}

export class AutoBattleDirector {
  startSeries(
    series: BattleSeriesState,
    now = new Date(),
  ): AutoBattleDirectorResult {
    const nextSeries =
      battleScheduler.startSeries(
        series,
        now,
      );

    return {
      series: nextSeries,
      battle: null,
      action:
        nextSeries === series
          ? "none"
          : "series_started",
    };
  }

  startRound(
    series: BattleSeriesState,
    input: StartBattleRoundInput,
  ): AutoBattleDirectorResult {
    const now =
      input.now ?? new Date();

    if (
      series.status !== "active" ||
      input.battle.status !== "waiting"
    ) {
      return {
        series,
        battle: input.battle,
        action: "none",
      };
    }

    const durationSeconds =
      input.durationSeconds ??
      series.config
        .battleDurationSeconds;

    const nextBattle =
      battleStateManager.start(
        input.battle,
        durationSeconds,
        now,
      );

    const nextSeries =
      battleScheduler.startCurrentRound(
        series,
        nextBattle.id,
        now,
      );

    return {
      series: nextSeries,
      battle: nextBattle,
      action: "round_started",
    };
  }

  finishRound(
    input: FinishBattleRoundInput,
  ): AutoBattleDirectorResult {
    const now =
      input.now ?? new Date();

    const finishedBattle =
      battleStateManager.finish(
        input.battle,
      );

    const nextSeries =
      battleScheduler.finishCurrentRound(
        input.series,
        finishedBattle.winnerId,
        finishedBattle.left.creatorId,
        finishedBattle.right.creatorId,
        now,
      );

    if (
      nextSeries.status ===
      "finished"
    ) {
      return {
        series: nextSeries,
        battle: finishedBattle,
        action: "series_finished",
      };
    }

    return {
      series: nextSeries,
      battle: finishedBattle,
      action: "intermission",
    };
  }

  tick(
    series: BattleSeriesState,
    battle: LiveBattleState | null,
    now = new Date(),
  ): AutoBattleDirectorResult {
    if (
      series.status ===
      "cancelled"
    ) {
      return {
        series,
        battle,
        action: "series_cancelled",
      };
    }

    if (
      series.status ===
      "finished"
    ) {
      return {
        series,
        battle,
        action: "series_finished",
      };
    }

    if (
      series.status ===
      "intermission"
    ) {
      const nextSeries =
        battleScheduler.advanceToNextRound(
          series,
          now,
        );

      return {
        series: nextSeries,
        battle: null,
        action:
          nextSeries === series
            ? "none"
            : "next_round_ready",
      };
    }

    if (
      series.status === "active" &&
      battle?.status === "active"
    ) {
      const nextBattle =
        battleStateManager.finishIfExpired(
          battle,
          now,
        );

      if (
        nextBattle.status ===
        "finished"
      ) {
        return this.finishRound({
          series,
          battle: nextBattle,
          now,
        });
      }
    }

    return {
      series,
      battle,
      action: "none",
    };
  }

  cancel(
    series: BattleSeriesState,
    battle: LiveBattleState | null,
  ): AutoBattleDirectorResult {
    return {
      series:
        battleScheduler.cancelSeries(
          series,
        ),
      battle,
      action: "series_cancelled",
    };
  }
}

export const autoBattleDirector =
  new AutoBattleDirector();
