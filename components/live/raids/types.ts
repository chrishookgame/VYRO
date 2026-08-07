export interface RaidBoss{

    id:string;

    name:string;

    maxHealth:number;

    currentHealth:number;

    level:number;

    alive:boolean;

}

export interface RaidPlayer{

    creatorId:string;

    creatorName:string;

    damage:number;

}

export interface RaidState{

    boss:RaidBoss;

    players:RaidPlayer[];

}
