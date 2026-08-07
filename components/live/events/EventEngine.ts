import type{
LiveEvent,
}from "./types";

export function createEventState(
events:LiveEvent[],
){

return{

events,

active:
events.filter(
e=>e.active,
).length,

};

}
