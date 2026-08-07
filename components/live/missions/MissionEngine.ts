import type{
Mission,
}from "./types";

export function createMissionState(
missions:Mission[],
){

return{

missions,

totalCompleted:
missions.filter(
m=>m.completed,
).length,

};

}
