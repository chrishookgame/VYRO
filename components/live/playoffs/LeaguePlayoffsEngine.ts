export enum PlayoffStage {
  ROUND16="ROUND16",
  QUARTER="QUARTER",
  SEMI="SEMI",
  FINAL="FINAL"
}

export interface LeaguePlayer {

  id:string;

  name:string;

  score:number;

  league:string;

  wins:number;

  losses:number;

  streak:number;

}

export interface PlayoffBattle{

  id:string;

  stage:PlayoffStage;

  left:LeaguePlayer;

  right:LeaguePlayer;

  winner:string|null;

  probabilityLeft:number;

  probabilityRight:number;

}

export interface PromotionResult{

  promoted:boolean;

  relegated:boolean;

  nextLeague:string;

  reward:number;

}

export interface InfinityPlayer{

  id:string;

  creator:string;

  rank:number;

  score:number;

  crowns:number;

}
