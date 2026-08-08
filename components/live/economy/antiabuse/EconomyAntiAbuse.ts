export interface EconomyRiskInput {
  giftValue:number;
  quantity:number;
  eventsLastMinute:number;
  senderSpendLastMinute:number;
}

export interface EconomyRiskResult {
  score:number;
  blocked:boolean;
  reason:
    | "OK"
    | "INVALID_VALUE"
    | "EXCESSIVE_QUANTITY"
    | "EVENT_RATE"
    | "SPEND_RATE";
}

function safePositive(
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

export function evaluateEconomyRisk(
  input:EconomyRiskInput,
):EconomyRiskResult{
  const giftValue=
    safePositive(
      input.giftValue,
    );

  const quantity=
    Math.floor(
      safePositive(
        input.quantity,
      ),
    );

  const eventsLastMinute=
    Math.floor(
      safePositive(
        input.eventsLastMinute,
      ),
    );

  const senderSpendLastMinute=
    safePositive(
      input.senderSpendLastMinute,
    );

  if(giftValue <= 0){
    return {
      score:100,
      blocked:true,
      reason:"INVALID_VALUE",
    };
  }

  if(quantity > 100){
    return {
      score:90,
      blocked:true,
      reason:"EXCESSIVE_QUANTITY",
    };
  }

  if(eventsLastMinute > 120){
    return {
      score:85,
      blocked:true,
      reason:"EVENT_RATE",
    };
  }

  if(senderSpendLastMinute > 100000){
    return {
      score:80,
      blocked:true,
      reason:"SPEND_RATE",
    };
  }

  const score=
    Math.min(
      79,
      Math.round(
        eventsLastMinute * 0.25 +
        quantity * 0.2,
      ),
    );

  return {
    score,
    blocked:false,
    reason:"OK",
  };
}
