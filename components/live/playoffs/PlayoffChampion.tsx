export function createPlayoffBracket(players:any[]){

    return players
        .sort((a,b)=>b.score-a.score)
        .map((player,index)=>({

            seed:index+1,

            creatorId:player.creatorId,

            creatorName:player.creatorName,

            score:player.score,

            qualified:index<16

        }));

}
