export type CampaignStatus =
  | "draft"
  | "scheduled"
  | "active"
  | "paused"
  | "finished";

export interface Campaign {

  id: string;

  name: string;

  sponsor: string;

  status: CampaignStatus;

  startsAt: string;

  endsAt: string;

  budget: number;

  enabled: boolean;

}
