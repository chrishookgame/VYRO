export function calculateCoins(score:number){
return{
coins:score*10,
bonus:Math.floor(score/100),
};
}
