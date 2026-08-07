"use client";

import { useMemo } from "react";

import type {
    SeasonPlayer,
    SeasonState,
} from "@/components/live/seasons/types";

interface UseSeasonEngineInput{

    players:SeasonPlayer[];

    season:number;

}

export function useSeasonEngine({

    players,

    season,

}:UseSeasonEngineInput){

    return useMemo(()=>{

        const ranking=[...players]
            .sort(
                (a,b)=>b.score-a.score,
            );

        const state:SeasonState={

            season,

            active:true,

            players:ranking,

        };

        return{

            state,

            champion:
                ranking[0] ?? null,

            totalPlayers:
                ranking.length,

        };

    },[players,season]);

}
