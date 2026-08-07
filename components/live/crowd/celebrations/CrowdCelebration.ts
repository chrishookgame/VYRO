export function resolveCrowdCelebration(
  hype: number,
  comebackActive: boolean,
  recordBroken: boolean,
) {
  if (recordBroken) {
    return {
      trigger: true,
      type: "WORLD_RECORD",
      intensity: "LEGENDARY",
    };
  }

  if (
    comebackActive &&
    hype >= 90
  ) {
    return {
      trigger: true,
      type: "COMEBACK",
      intensity: "LEGENDARY",
    };
  }

  if (hype >= 75) {
    return {
      trigger: true,
      type: "CROWD_HYPE",
      intensity: "EPIC",
    };
  }

  return {
    trigger: false,
    type: "NONE",
    intensity: "NORMAL",
  };
}
