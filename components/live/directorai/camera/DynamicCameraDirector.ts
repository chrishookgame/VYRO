export interface DynamicCameraInput {
  excitementScore:number;
  predictionImminent:boolean;
  worldMoment:boolean;
  legendaryMoment:boolean;
}

export interface DynamicCameraState {
  mode:
    | "STABLE"
    | "FOCUS"
    | "IMPACT"
    | "CINEMATIC"
    | "WORLD";

  zoom:number;
  motion:number;
  cutSpeedMs:number;
}

export function createDynamicCameraState(
  input:DynamicCameraInput,
):DynamicCameraState{
  const mode=
    input.worldMoment
      ? "WORLD"
      : input.legendaryMoment
        ? "CINEMATIC"
        : input.predictionImminent &&
          input.excitementScore >= 70
          ? "IMPACT"
          : input.excitementScore >= 45
            ? "FOCUS"
            : "STABLE";

  return {
    mode,

    zoom:
      mode === "WORLD"
        ? 1.08
        : mode === "CINEMATIC"
          ? 1.06
          : mode === "IMPACT"
            ? 1.04
            : mode === "FOCUS"
              ? 1.02
              : 1,

    motion:
      Math.min(
        1,
        Math.max(
          0,
          input.excitementScore / 100,
        ),
      ),

    cutSpeedMs:
      mode === "WORLD"
        ? 900
        : mode === "CINEMATIC"
          ? 1100
          : mode === "IMPACT"
            ? 1400
            : mode === "FOCUS"
              ? 2000
              : 3000,
  };
}
