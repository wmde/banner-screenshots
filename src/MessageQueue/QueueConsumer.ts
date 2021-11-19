import { MetadataMessageHandler, TestCaseMessageHandler } from "./Messages";

export default class QueueConsumer {

	consumeScreenshotQueue( onScreenshotMessage: TestCaseMessageHandler ): Promise<void> {
		throw new Error("Not Implemented");
	}

	consumeMetaDataQueue( onMetaDataMessage: MetadataMessageHandler ): never {
		throw new Error("Not Implemented");
	}
}
