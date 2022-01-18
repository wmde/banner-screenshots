import { SerializedCampaignMetadata } from "./MetadataSerializer";

interface MetadataSummary {
	campaign: string,
	createdOn: string,
	testCaseCount: number
}


/**
 * Creates a summary of metadata items
 */
export default function summarizeMetadata( metaDataList: SerializedCampaignMetadata[] ): MetadataSummary[] {
	return metaDataList.map( metadata => {
		return {
			campaign: metadata.campaign,
			createdOn: metadata.createdOn.toString(),
			testCaseCount: metadata.testCases.length
		}
	} );
}
