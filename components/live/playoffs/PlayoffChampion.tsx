import type { LeaguePlayer } from "./LeaguePlayoffsEngine";

export function createPlayoffBracket(
    players: LeaguePlayer[],
){

    return [...players]
        .sort(
            (a,b)=>b.score-a.score,
        )
        .map(
            (player,index)=>({

                seed:index+1,

                creatorId:player.id,

                creatorName:player.name,

                score:player.score,

                qualified:index<16,

            }),
        );

}
