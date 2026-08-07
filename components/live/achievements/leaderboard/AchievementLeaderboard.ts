import type{
Achievement,
}from "../types";

export function createAchievementLeaderboard(
achievements:Achievement[],
){

return [...achievements]
.sort(
(a,b)=>
b.level-a.level,
);

}
