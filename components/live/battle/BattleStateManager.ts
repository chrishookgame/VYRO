import type {
  LiveBattleSide,
  LiveBattleState,
} from "./LiveBattleEngine";

export interface BattleScoreInput {
  creatorId: string;
  score?: number;
  giftCount?: number;
  energy?: number;
}

function updateSide(
  side: LiveBattleSide,
  input: BattleScoreInput,
): LiveBattleSide {
  if (side.creatorId !== input.creatorId) {
    return side;
  }

  return {
    ...side,
    score:
      side.score +
      Math.max(0, input.score ?? 0),
    giftCount:
      side.giftCount +
      Math.max(0, input.giftCount ?? 0),
    energy:
      side.energy +
      Math.max(0, input.energy ?? 0),
  };
}

export class BattleStateManager {
  start(
    battle: LiveBattleState,
    durationSeconds: number,
    now = new Date(),
  ): LiveBattleState {
    if (battle.status !== "waiting") {
      return battle;
    }

    const safeDuration =
      Math.max(
        1,
        Math.floor(durationSeconds),
      );

    const endsAt =
      new Date(
        now.getTime() +
          safeDuration * 1000,
      );

    return {
      ...battle,
      status: "active",
      startedAt: now.toISOString(),
      endsAt: endsAt.toISOString(),
      winnerId: null,
    };
  }

  addScore(
    battle: LiveBattleState,
    input: BattleScoreInput,
  ): LiveBattleState {
    if (battle.status !== "active") {
      return battle;
    }

    return {
      ...battle,
      left: updateSide(
        battle.left,
        input,
      ),
      right: updateSide(
        battle.right,
        input,
      ),
    };
  }

  finish(
    battle: LiveBattleState,
  ): LiveBattleState {
    if (battle.status === "finished") {
      return battle;
    }

    let winnerId: string | null = null;

    if (
      battle.left.score >
      battle.right.score
    ) {
      winnerId =
        battle.left.creatorId;
    }

    if (
      battle.right.score >
      battle.left.score
    ) {
      winnerId =
        battle.right.creatorId;
    }

    return {
      ...battle,
      status: "finished",
      winnerId,
    };
  }

  finishIfExpired(
    battle: LiveBattleState,
    now = new Date(),
  ): LiveBattleState {
    if (
      battle.status !== "active" ||
      !battle.endsAt
    ) {
      return battle;
    }

    const endsAt =
      new Date(
        battle.endsAt,
      ).getTime();

    if (
      Number.isNaN(endsAt) ||
      now.getTime() < endsAt
    ) {
      return battle;
    }

    return this.finish(battle);
  }

  getRemainingSeconds(
    battle: LiveBattleState,
    now = new Date(),
  ): number {
    if (
      battle.status !== "active" ||
      !battle.endsAt
    ) {
      return 0;
    }

    const remaining =
      new Date(
        battle.endsAt,
      ).getTime() -
      now.getTime();

    if (
      !Number.isFinite(remaining) ||
      remaining <= 0
    ) {
      return 0;
    }

    return Math.ceil(
      remaining / 1000,
    );
  }
}

export const battleStateManager =
  new BattleStateManager();
