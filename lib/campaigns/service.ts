import type { Campaign } from "./types";

export class CampaignEngine {

  private campaigns: Campaign[] = [];

  getAll(): Campaign[] {

    return this.campaigns;

  }

  add(campaign: Campaign): void {

    this.campaigns.push(campaign);

  }

  getActive(now: Date = new Date()) {

    return this.campaigns.filter(campaign => {

      const start = new Date(campaign.startsAt);

      const end = new Date(campaign.endsAt);

      return (
        campaign.enabled &&
        campaign.status === "active" &&
        start <= now &&
        end >= now
      );

    });

  }

}
