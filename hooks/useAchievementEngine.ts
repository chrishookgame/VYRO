"use client";

import {useMemo} from "react";

import type{
Achievement,
}from "@/components/live/achievements/types";

export function useAchievementEngine(
achievements:Achievement[],
){

return useMemo(()=>{

const completed=
achievements.filter(
a=>a.completed,
).length;

return{

achievements,

completed,

remaining:
achievements.length-completed,

progress:
achievements.length===0
?0
:Math.round(
completed*100/
achievements.length,
),

};

},[achievements]);

}
