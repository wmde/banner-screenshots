/**
 * Creates a summary of metadata items
 */
export default class MetadataSummarizer {
	getSummary( metaDataList ) {
		return metaDataList.map( metadata => {
			return {
				campaign: metadata.campaign,
				createdOn: metadata.createdOn,
				testCaseCount: metadata.testCases.length
			}
		} );
	}
}