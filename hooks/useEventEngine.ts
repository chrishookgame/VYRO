"use client";

import {useMemo} from "react";

import type{
LiveEvent,
}from "@/components/live/events/types";

export function useEventEngine(
events:LiveEvent[],
){

return useMemo(()=>{

return{

events,

active:
events.filter(
e=>e.active,
).length,

completed:
events.filter(
e=>e.progress>=e.target,
).length,

};

},[events]);

}
