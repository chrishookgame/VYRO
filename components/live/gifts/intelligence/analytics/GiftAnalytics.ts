export function calculateGiftAnalytics(
  amount:number,
  creatorEarnings:number,
  energy:number,
  multiplier:number,
  excitementScore:number,
){
  const grossValue=
    Math.max(
      0,
      Number.isFinite(amount)
        ? amount
        : 0,
    );

  const creatorValue=
    Math.min(
      grossValue,
      Math.max(
        0,
        Number.isFinite(creatorEarnings)
          ? creatorEarnings
          : 0,
      ),
    );

  return {
    grossValue,
    creatorValue,
    platformValue:
      Math.max(
        0,
        grossValue-creatorValue,
      ),
    energy:
      Math.max(
        0,
        Number.isFinite(energy)
          ? energy
          : 0,
      ),
    intelligenceValue:
      Number(
        (
          grossValue *
          Math.max(1,multiplier) *
          (
            1 +
            Math.max(0,excitementScore)/100
          )
        ).toFixed(2),
      ),
  };
}
