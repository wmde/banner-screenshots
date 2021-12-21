import CampaignMetadata from "./CampaignMetadata";

export interface CampaignMetadataRepository {
    loadMetadata( campaignName: string ): CampaignMetadata;
    saveMetadata( metadata: CampaignMetadata ): void;
}
