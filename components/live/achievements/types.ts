export interface Achievement{

id:string;

title:string;

description:string;

level:number;

completed:boolean;

reward:number;

}

export interface AchievementState{

achievements:Achievement[];

completed:number;

}
