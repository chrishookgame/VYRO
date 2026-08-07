export type BossPhase=
| "PHASE_1"
| "PHASE_2"
| "PHASE_3"
| "FINAL";

export function getBossPhase(
healthPercentage:number,
):BossPhase{

if(healthPercentage>75){
return "PHASE_1";
}

if(healthPercentage>50){
return "PHASE_2";
}

if(healthPercentage>20){
return "PHASE_3";
}

return "FINAL";

}
