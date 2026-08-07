export type TournamentLevel =
  | "NATIONAL"
  | "CONTINENTAL"
  | "WORLD";

export interface TournamentPlayer{

    creatorId:string;

    creatorName:string;

    countryCode:string;

    score:number;

    wins:number;

}

export interface TournamentState{

    season:number;

    level:TournamentLevel;

    players:TournamentPlayer[];

}
