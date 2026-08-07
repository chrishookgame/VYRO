export function calculateRewards(points:number){

    return{

        coins:points*5,

        gems:Math.floor(points/20),

        xp:points*12

    };

}
