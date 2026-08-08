export interface LiveCrowdInput {
  activeSenders:number;
  giftCount:number;
  hypeScore:number;
}

export interface LiveCrowdState {
  crowdPower:number;

  reaction:
    | "IDLE"
    | "CHEER"
    | "ROAR"
    | "ERUPTION";
}

export function createLiveCrowdState(
  input:LiveCrowdInput,
):LiveCrowdState{
  const crowdPower=
    Math.min(
      100,
      Math.round(
        Math.max(0,input.activeSenders) * 8 +
        Math.max(0,input.giftCount) * 1.2 +
        Math.max(0,input.hypeScore) * 0.4,
      ),
    );

  return {
    crowdPower,

    reaction:
      crowdPower >= 85
        ? "ERUPTION"
        : crowdPower >= 60
          ? "ROAR"
          : crowdPower >= 30
            ? "CHEER"
            : "IDLE",
  };
}
