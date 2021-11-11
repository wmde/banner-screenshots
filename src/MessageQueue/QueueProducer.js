// Abstract class, should be an interface in TypeScript
export default class QueueProducer {
	async sendTestCase( testCaseMessage ) {
		throw new Error("Not Implemented");
	}
	async sendMetadataUpdate( newTestCaseStatusMessage ) {
		throw new Error("Not Implemented");
	}
	// TODO metadataMessage contains test case name and output path
	async sendMetadataSummary( metadataMessage ) {
		throw new Error("Not Implemented");
	}

	async disconnect() {
		throw new Error("Not Implemented");
	}
}


