export function calculateInflation(activePlayers:number){
return{
rate:Math.min(10,activePlayers/100000),
};
}
