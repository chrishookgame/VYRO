import type {
  VyroBattleCrowdInput,
  VyroCrowdState,
} from "./types";

export function createCrowdState(
  input: VyroBattleCrowdInput,
): VyroCrowdState {
  const fanPower =
    Math.max(
      0,
      input.supportPoints +
      input.reactions * 5 +
      input.viewers * 2,
    );

  const hype =
    Math.min(
      100,
      Math.round(
        fanPower / 100,
      ),
    );

  const comebackActive =
    input.secondsRemaining <= 30 &&
    input.scoreDifference <= 500;

  let celebrationLevel:
    VyroCrowdState["celebrationLevel"] =
      "NORMAL";

  if (hype >= 90) {
    celebrationLevel = "LEGENDARY";
  } else if (hype >= 65) {
    celebrationLevel = "EPIC";
  }

  return {
    viewers:
      input.viewers,

    reactions:
      input.reactions,

    supportPoints:
      input.supportPoints,

    hype,
    fanPower,
    comebackActive,
    celebrationLevel,
  };
}
