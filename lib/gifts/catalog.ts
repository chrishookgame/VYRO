import type { Gift } from "./types";

export const DefaultGiftCatalog: Gift[] = [

{
id:"rose",
name:"VYRO Rose",
rarity:"common",
price:1,
energy:5,
animation:"rose",
icon:"🌹",
enabled:true
},

{
id:"diamond",
name:"VYRO Diamond",
rarity:"rare",
price:20,
energy:80,
animation:"diamond",
icon:"💎",
enabled:true
},

{
id:"phoenix",
name:"VYRO Phoenix",
rarity:"epic",
price:100,
energy:300,
animation:"phoenix",
icon:"🔥",
enabled:true
},

{
id:"galaxy",
name:"Galaxy Explosion",
rarity:"legendary",
price:500,
energy:1200,
animation:"galaxy",
icon:"🌌",
enabled:true
},

{
id:"universe",
name:"Universe Creator",
rarity:"mythic",
price:1500,
energy:5000,
animation:"universe",
icon:"✨",
enabled:true
}

];
