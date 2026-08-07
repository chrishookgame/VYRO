"use client";

import {useMemo} from "react";

import type{
Mission,
}from "@/components/live/missions/types";

export function useMissionProgress(
missions:Mission[],
){

return useMemo(()=>{

const completed=
missions.filter(
m=>m.completed,
).length;

return{

missions,

completed,

remaining:
missions.length-completed,

progress:
missions.length===0
?0
:Math.round(
completed*100/
missions.length,
),

};

},[missions]);

}
