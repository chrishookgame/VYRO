export interface GiftAnalyticsInput {
  amount:number;
  creatorEarnings:number;
  energy:number;
  multiplier:number;
  excitementScore:number;
}

export interface GiftAnalyticsState {
  grossValue:number;
  creatorValue:number;
  platformValue:number;
  energy:number;
  intelligenceValue:number;
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

export function calculateGiftAnalytics(
  input:GiftAnalyticsInput,
):GiftAnalyticsState{
  const grossValue=
    safePositive(
      input.amount,
    );

  const creatorValue=
    Math.min(
      grossValue,
      safePositive(
        input.creatorEarnings,
      ),
    );

  return {
    grossValue,

    creatorValue,

    platformValue:
      Math.max(
        0,
        grossValue -
        creatorValue,
      ),

    energy:
      safePositive(
        input.energy,
      ),

    intelligenceValue:
      Number(
        (
          grossValue *
          Math.max(
            1,
            input.multiplier,
          ) *
          (
            1 +
            Math.max(
              0,
              input.excitementScore,
            ) /
            100
          )
        ).toFixed(2),
      ),
  };
}
