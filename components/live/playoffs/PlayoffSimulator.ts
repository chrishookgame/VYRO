export function simulateBattle(left:number,right:number){

    const total=Math.max(left+right,1);

    return{

        leftProbability:
            Math.round(left/total*100),

        rightProbability:
            Math.round(right/total*100),

        winner:
            left>=right
                ?"LEFT"
                :"RIGHT"

    };

}
