import type {
  WorldLeagueDivision,
} from "../types/WorldLeagueTypes";

export const WorldLeagueDivisions:{
  division:WorldLeagueDivision;
  minimumPoints:number;
}[]=[
  {
    division:"BRONZE",
    minimumPoints:0,
  },
  {
    division:"SILVER",
    minimumPoints:1000,
  },
  {
    division:"GOLD",
    minimumPoints:2500,
  },
  {
    division:"DIAMOND",
    minimumPoints:5000,
  },
  {
    division:"ROYAL",
    minimumPoints:10000,
  },
  {
    division:"INFINITY",
    minimumPoints:20000,
  },
];

export function resolveLeagueDivision(
  points:number,
):WorldLeagueDivision{
  const safePoints=
    Math.max(
      0,
      points,
    );

  let resolved:WorldLeagueDivision=
    "BRONZE";

  for(
    const item of WorldLeagueDivisions
  ){
    if(
      safePoints >=
      item.minimumPoints
    ){
      resolved=
        item.division;
    }
  }

  return resolved;
}
