export interface LivePerformanceInput {
  excitementScore:number;
  intensity:number;
  priority:number;
  motion:number;
}

export interface LivePerformanceState {
  loadScore:number;

  profile:
    | "ECO"
    | "BALANCED"
    | "PERFORMANCE"
    | "CINEMATIC";

  reduceAmbientEffects:boolean;
}

export function createLivePerformanceState(
  input:LivePerformanceInput,
):LivePerformanceState{
  const loadScore=
    Math.min(
      100,
      Math.round(
        Math.max(
          0,
          input.excitementScore * 0.3 +
          input.intensity * 0.3 +
          input.priority * 0.25 +
          input.motion * 100 * 0.15,
        ),
      ),
    );

  return {
    loadScore,

    profile:
      loadScore >= 85
        ? "CINEMATIC"
        : loadScore >= 65
          ? "PERFORMANCE"
          : loadScore >= 30
            ? "BALANCED"
            : "ECO",

    reduceAmbientEffects:
      loadScore >= 90,
  };
}
