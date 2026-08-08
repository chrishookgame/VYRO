import type {
  LiveBattleState,
} from "./LiveBattleEngine";

import {
  battleStateManager,
  type BattleScoreInput,
} from "./BattleStateManager";

export interface BattleGiftEvent {
  giftId: string;
  battleId: string;
  receiverId: string;
  giftCode: string;
  giftName: string;
  quantity?: number;
  unitValue: number;
  energyValue: number;
  intelligenceMultiplier?: number;
}

export interface BattleGiftResult {
  battle: LiveBattleState;
  scoreAdded: number;
  giftCountAdded: number;
  energyAdded: number;
  applied: boolean;
}

function normalizePositive(
  value: number,
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, value);
}

export class BattleGiftEngine {
  applyGift(
    battle: LiveBattleState,
    event: BattleGiftEvent,
  ): BattleGiftResult {
    if (
      battle.status !== "active" ||
      battle.id !== event.battleId
    ) {
      return {
        battle,
        scoreAdded: 0,
        giftCountAdded: 0,
        energyAdded: 0,
        applied: false,
      };
    }

    const belongsToBattle =
      event.receiverId ===
        battle.left.creatorId ||
      event.receiverId ===
        battle.right.creatorId;

    if (!belongsToBattle) {
      return {
        battle,
        scoreAdded: 0,
        giftCountAdded: 0,
        energyAdded: 0,
        applied: false,
      };
    }

    const quantity = Math.max(
      1,
      Math.floor(
        normalizePositive(
          event.quantity ?? 1,
        ),
      ),
    );

    const giftValue =
      normalizePositive(
        event.unitValue,
      ) * quantity;

    const energyAdded =
      normalizePositive(
        event.energyValue,
      ) * quantity;

    const scoreAdded =
      Math.round(
        giftValue * 100 +
        energyAdded,
      );

    const scoreInput:
      BattleScoreInput = {
        creatorId:
          event.receiverId,
        score: scoreAdded,
        giftCount: quantity,
        energy: energyAdded,
      };

    return {
      battle:
        battleStateManager.addScore(
          battle,
          scoreInput,
        ),
      scoreAdded,
      giftCountAdded: quantity,
      energyAdded,
      applied: true,
    };
  }
}

export const battleGiftEngine =
  new BattleGiftEngine();
