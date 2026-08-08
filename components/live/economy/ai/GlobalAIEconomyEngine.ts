import {
  evaluateEconomyRisk,
  type EconomyRiskResult,
} from "../antiabuse/EconomyAntiAbuse";

import {
  calculateLiveRevenue,
  type LiveRevenueAnalytics,
} from "../revenue/LiveRevenueAnalytics";

export interface AIEconomyInput {
  coins:number;
  gems:number;
  treasury:number;
  inflation:number;

  giftValue:number;
  quantity:number;

  eventsLastMinute:number;
  senderSpendLastMinute:number;

  transactionCount:number;

  platformRate?:number;
  creatorRate?:number;
}

export interface AIEconomyState {
  coins:number;
  gems:number;
  treasury:number;
  inflation:number;

  optimizedGiftValue:number;
  rewardMultiplier:number;

  risk:EconomyRiskResult;
  revenue:LiveRevenueAnalytics;

  canApplyReward:boolean;
}

function safePositive(
  value:number,
):number{
  if(!Number.isFinite(value)){
    return 0;
  }

  return Math.max(
    0,
    value,
  );
}

function normalizeInflation(
  value:number,
):number{
  if(!Number.isFinite(value)){
    return 0;
  }

  return Math.min(
    1,
    Math.max(
      0,
      value,
    ),
  );
}

export function createGlobalAIEconomyState(
  input:AIEconomyInput,
):AIEconomyState{
  const inflation=
    normalizeInflation(
      input.inflation,
    );

  const risk=
    evaluateEconomyRisk({
      giftValue:
        input.giftValue,

      quantity:
        input.quantity,

      eventsLastMinute:
        input.eventsLastMinute,

      senderSpendLastMinute:
        input.senderSpendLastMinute,
    });

  const inflationFactor=
    1 -
    inflation * 0.25;

  const activityFactor=
    input.eventsLastMinute >= 30
      ? 1.05
      : 1;

  const rewardMultiplier=
    Math.max(
      0.5,
      Math.min(
        1.25,
        inflationFactor *
        activityFactor,
      ),
    );

  const optimizedGiftValue=
    risk.blocked
      ? 0
      : safePositive(
          input.giftValue,
        ) *
        Math.max(
          1,
          Math.floor(
            safePositive(
              input.quantity,
            ),
          ),
        );

  const revenue=
    calculateLiveRevenue({
      grossValue:
        optimizedGiftValue,

      platformRate:
        input.platformRate ??
        0.3,

      creatorRate:
        input.creatorRate ??
        0.7,

      transactionCount:
        input.transactionCount,
    });

  return {
    coins:
      safePositive(
        input.coins,
      ),

    gems:
      safePositive(
        input.gems,
      ),

    treasury:
      safePositive(
        input.treasury,
      ),

    inflation,

    optimizedGiftValue,

    rewardMultiplier,

    risk,
    revenue,

    canApplyReward:
      !risk.blocked &&
      optimizedGiftValue > 0,
  };
}
