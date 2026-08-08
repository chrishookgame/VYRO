export interface RuntimeClockState {
  now:number;
  sequence:number;
  timestamp:string;
}

export function createRuntimeClockState(
  now:number,
  sequence=0,
):RuntimeClockState{
  const safeNow=
    Number.isFinite(now)
      ? Math.max(0,now)
      : 0;

  return {
    now:safeNow,

    sequence:
      Math.max(
        0,
        Math.floor(sequence),
      ),

    timestamp:
      new Date(
        safeNow,
      ).toISOString(),
  };
}
