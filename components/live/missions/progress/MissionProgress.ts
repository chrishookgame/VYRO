export function calculateMissionProgress(
progress:number,
target:number,
){

return{

percentage:
Math.min(
100,
Math.round(progress/Math.max(target,1)*100),
),

completed:
progress>=target,

};

}
