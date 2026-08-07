export type CompetitiveLiveIntensity =
  | "CALM"
  | "ACTIVE"
  | "HOT"
  | "LEGENDARY";

export function resolveCompetitiveLiveStatus(
  hype: number,
) {
  const safeHype =
    Math.min(
      100,
      Math.max(
        0,
        hype,
      ),
    );

  let intensity:CompetitiveLiveIntensity=
    "CALM";

  if(safeHype >= 85){
    intensity="LEGENDARY";
  }else if(safeHype >= 60){
    intensity="HOT";
  }else if(safeHype >= 30){
    intensity="ACTIVE";
  }

  return {
    hype:safeHype,
    intensity,

    showHypeBanner:
      safeHype >= 60,

    showLegendaryEffect:
      safeHype >= 85,
  };
}
