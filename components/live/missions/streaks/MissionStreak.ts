export function calculateMissionStreak(
current:number,
completed:boolean,
){

return completed
?current+1
:0;

}
