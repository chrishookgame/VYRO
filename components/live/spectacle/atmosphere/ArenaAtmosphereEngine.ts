export interface ArenaAtmosphereInput {
  hypeScore:number;
  heatScore:number;
  viral:boolean;
  stormIntensity:number;
}

export interface ArenaAtmosphereState {
  intensity:number;

  level:
    | "CALM"
    | "RISING"
    | "HOT"
    | "EPIC"
    | "WORLD";

  pulse:number;
  glow:number;
}

export function createArenaAtmosphereState(
  input:ArenaAtmosphereInput,
):ArenaAtmosphereState{
  const intensity=
    Math.min(
      100,
      Math.round(
        Math.max(0,input.hypeScore) * 0.35 +
        Math.max(0,input.heatScore) * 0.35 +
        Math.max(0,input.stormIntensity) * 0.2 +
        (input.viral ? 10 : 0),
      ),
    );

  return {
    intensity,

    level:
      intensity >= 90
        ? "WORLD"
        : intensity >= 75
          ? "EPIC"
          : intensity >= 55
            ? "HOT"
            : intensity >= 25
              ? "RISING"
              : "CALM",

    pulse:
      Number(
        (
          1 +
          intensity / 500
        ).toFixed(2),
      ),

    glow:
      Number(
        (
          intensity / 100
        ).toFixed(2),
      ),
  };
}
