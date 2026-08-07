export function calculateDynamicDifficulty(
participants:number,
){

return{

damageMultiplier:
Math.max(
1,
participants/100,
),

healthMultiplier:
Math.max(
1,
participants/50,
),

};

}
