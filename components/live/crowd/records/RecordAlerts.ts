export interface VyroRecordAlert {
  creatorId: string;
  creatorName: string;

  recordName: string;

  currentValue: number;
  recordValue: number;

  distance: number;
  recordBroken: boolean;
}

export function createRecordAlert(
  creatorId: string,
  creatorName: string,
  recordName: string,
  currentValue: number,
  recordValue: number,
): VyroRecordAlert {
  return {
    creatorId,
    creatorName,
    recordName,

    currentValue,
    recordValue,

    distance:
      Math.max(
        0,
        recordValue -
        currentValue,
      ),

    recordBroken:
      currentValue >
      recordValue,
  };
}
