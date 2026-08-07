export type MissionType=
    |"DAILY"
    |"WEEKLY"
    |"GLOBAL"
    |"COMMUNITY";

export interface Mission{

    id:string;

    title:string;

    description:string;

    type:MissionType;

    progress:number;

    target:number;

    completed:boolean;

}

export interface MissionState{

    missions:Mission[];

    totalCompleted:number;

}
