export type EventType=
|"DAILY"
|"WEEKLY"
|"MONTHLY"
|"SEASONAL"
|"WORLD";

export interface LiveEvent{

id:string;

title:string;

type:EventType;

progress:number;

target:number;

reward:number;

active:boolean;

}

export interface EventState{

events:LiveEvent[];

active:number;

}
