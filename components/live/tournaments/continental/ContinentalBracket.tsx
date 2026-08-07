import type { TournamentPlayer } from "../types";

export function generateContinentalBracket(players:TournamentPlayer[]){

    return [...players]
        .sort((a,b)=>b.score-a.score)
        .slice(0,32);

}
