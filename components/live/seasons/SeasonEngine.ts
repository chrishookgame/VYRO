import type {
    SeasonPlayer,
} from "./types";

export function createSeasonRanking(
    players:SeasonPlayer[],
){

    return [...players]
        .sort(
            (a,b)=>b.score-a.score,
        );

}
