export interface LiveRevenueInput {
  grossValue:number;
  platformRate:number;
  creatorRate:number;
  transactionCount:number;
}

export interface LiveRevenueAnalytics {
  gross:number;
  platformRevenue:number;
  creatorRevenue:number;
  unallocated:number;
  transactionCount:number;
  averageTransaction:number;
}

function clampRate(
  value:number,
):number{
  if(!Number.isFinite(value)){
    return 0;
  }

  return Math.min(
    1,
    Math.max(
      0,
      value,
    ),
  );
}

function safeMoney(
  value:number,
):number{
  if(!Number.isFinite(value)){
    return 0;
  }

  return Math.max(
    0,
    value,
  );
}

export function calculateLiveRevenue(
  input:LiveRevenueInput,
):LiveRevenueAnalytics{
  const gross=
    safeMoney(
      input.grossValue,
    );

  const platformRate=
    clampRate(
      input.platformRate,
    );

  const creatorRate=
    clampRate(
      input.creatorRate,
    );

  const transactionCount=
    Math.max(
      0,
      Math.floor(
        input.transactionCount,
      ),
    );

  const platformRevenue=
    gross *
    platformRate;

  const creatorRevenue=
    gross *
    creatorRate;

  return {
    gross,
    platformRevenue,
    creatorRevenue,

    unallocated:
      Math.max(
        0,
        gross -
        platformRevenue -
        creatorRevenue,
      ),

    transactionCount,

    averageTransaction:
      transactionCount > 0
        ? gross /
          transactionCount
        : 0,
  };
}
