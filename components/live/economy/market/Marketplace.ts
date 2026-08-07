export function calculateMarketPrice(base:number,demand:number){
return Math.round(base*(1+demand/100));
}
