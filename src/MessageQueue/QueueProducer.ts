import {TestCaseMessage} from "./Messages";

// Abstract class, should be an interface in TypeScript
export default class QueueProducer {
	async sendTestCase( testCaseMessage: TestCaseMessage ) {
		throw new Error("Not Implemented");
	}

	// TODO metadataInitMessage contains an array of test cases, the campaign name
	async sendInitializeMetadata( metadataInitMessage ) {
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


