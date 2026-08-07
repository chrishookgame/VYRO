export function createEventLeaderboard(players:any[]){

return [...players]
.sort(
(a,b)=>b.score-a.score,
);

}
