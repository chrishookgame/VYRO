export interface SeasonPlayer{

    creatorId:string;

    creatorName:string;

    score:number;

    wins:number;

}
export interface SeasonState{

    season:number;

    active:boolean;

    players:SeasonPlayer[];

}
