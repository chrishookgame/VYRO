export function calculateRelegation(points:number){

    return{

        danger:
            points<900,

        safe:
            points>=900,

        percentage:
            Math.max(
                0,
                Math.min(
                    100,
                    Math.round(
                        (900-points)/9
                    )
                )
            )

    };

}
