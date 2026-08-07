interface EventLeaderboardPlayer{

creatorId:string;

creatorName:string;

score:number;

}

export function createEventLeaderboard(
players:EventLeaderboardPlayer[],
){

return [...players]
.sort(
(a,b)=>b.score-a.score,
);

}
