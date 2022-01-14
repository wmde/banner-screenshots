import { MetadataInitMessage, MetadataSummaryMessage, MetadataUpdateMessage, TestCaseMessage } from "./Messages";

// Abstract class, should be an interface (or several interfaces) in TypeScript
export default class QueueProducer {
	async sendTestCase(testCaseMessage: TestCaseMessage) {
		throw new Error("Not Implemented");
	}

	async sendInitializeMetadata(metadataInitMessage: MetadataInitMessage) {
		throw new Error("Not Implemented");
	}

	async sendMetadataUpdate(newTestCaseStatusMessage: MetadataUpdateMessage) {
		throw new Error("Not Implemented");
	}

	async sendMetadataSummary(metadataMessage: MetadataSummaryMessage) {
		throw new Error("Not Implemented");
	}
}
