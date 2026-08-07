export interface VyroFanSupporter {
  userId: string;
  userName: string;

  supportPoints: number;
  reactions: number;
  completedMissions: number;
  streak: number;
}

export interface VyroCrowdState {
  viewers: number;

  reactions: number;
  supportPoints: number;

  hype: number;
  fanPower: number;

  comebackActive: boolean;
  celebrationLevel: "NORMAL" | "EPIC" | "LEGENDARY";
}

export interface VyroBattleCrowdInput {
  viewers: number;

  reactions: number;
  supportPoints: number;

  scoreDifference: number;
  secondsRemaining: number;
}
