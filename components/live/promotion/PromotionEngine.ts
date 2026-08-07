export function calculatePromotion(points:number){

    if(points>=6000){

        return "INFINITY";

    }

    if(points>=4500){

        return "ROYAL";

    }

    if(points>=3000){

        return "DIAMOND";

    }

    if(points>=1800){

        return "GOLD";

    }

    if(points>=900){

        return "SILVER";

    }

    return "BRONZE";

}
