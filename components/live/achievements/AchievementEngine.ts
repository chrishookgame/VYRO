import type{
Achievement,
}from "./types";

export function createAchievementState(
achievements:Achievement[],
){

return{

achievements,

completed:
achievements.filter(
a=>a.completed,
).length,

};

}
