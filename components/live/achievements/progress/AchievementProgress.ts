export function calculateAchievementProgress(
completed:number,
total:number,
){

return{

percentage:
Math.min(
100,
Math.round(
completed*100/
Math.max(total,1),
),

),

remaining:
Math.max(
0,
total-completed,
),

};

}
