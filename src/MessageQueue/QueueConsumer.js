export default class QueueConsumer {
	/**
	 * @param {function} onScreenshotMessage
	 * @return never
	 */
	consumeScreenshotQueue( onScreenshotMessage ) {
		throw new Error("Not Implemented");
	}

	/**
	 * @param {function} onMetaDataMessage
	 * @return never
	 */
	consumeMetaDataQueue( onMetaDataMessage ) {
		throw new Error("Not Implemented");
	}
}
