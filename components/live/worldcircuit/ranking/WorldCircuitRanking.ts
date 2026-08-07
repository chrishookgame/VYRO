import type {
  WorldCircuitCompetitor,
} from "../types/WorldCircuitTypes";

import {
  calculateGlobalCircuitPoints,
} from "../points/GlobalCircuitPoints";

export function createWorldCircuitRanking(
  competitors: WorldCircuitCompetitor[],
) {
  return competitors
    .map(
      competitor => ({
        ...competitor,

        circuitPoints:
          calculateGlobalCircuitPoints(
            competitor,
          ),
      }),
    )
    .sort(
      (a,b) => {
        if(
          b.circuitPoints !==
          a.circuitPoints
        ){
          return (
            b.circuitPoints -
            a.circuitPoints
          );
        }

        if(
          b.championships !==
          a.championships
        ){
          return (
            b.championships -
            a.championships
          );
        }

        return (
          b.victories -
          a.victories
        );
      },
    )
    .map(
      (competitor,index) => ({
        ...competitor,

        worldRank:
          index + 1,
      }),
    );
}
