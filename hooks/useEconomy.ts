"use client";

import {useMemo} from "react";

import{
createEconomyState,
}from "@/components/live/economy/EconomyEngine";

export function useEconomy(
coins:number,
gems:number,
treasury:number,
inflation:number,
){
return useMemo(
()=>createEconomyState(
coins,
gems,
treasury,
inflation,
),
[
coins,
gems,
treasury,
inflation,
],
);
}
