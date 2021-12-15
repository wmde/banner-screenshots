import { BrowserFactory, DEFAULT_CONNECTION_PARAMS, factoryOptions } from "./src/TBBrowserFactory.js";
import {CapabilityFactory} from "./src/TBCapabilityFactory.js";
import {createImageWriter} from "./src/writeImageData.js";
import RabbitMQConsumer from "./src/MessageQueue/RabbitMQConsumer";
import {TestCaseMessage} from "./src/MessageQueue/Messages";
import {unserializeTestCase} from "./src/Model/TestCaseSerializer";
import EnvironmentConfig from "./src/EnvironmentConfig";
import { getTestFunction } from "./src/test_functions";

const config = EnvironmentConfig.create();

const connectionOptions = {
	...DEFAULT_CONNECTION_PARAMS,
	user: config.testingBotApiKey,
	key: config.testingBotApiSecret
}

const browserFactory = new BrowserFactory( connectionOptions,
	new CapabilityFactory( factoryOptions )
);

const consumer = new RabbitMQConsumer( config.queueUrl, "Connection established, hit Ctrl-C to quit worker" );

// TODO create ScreenshotMessage type
consumer.consumeScreenshotQueue( async (msgData: TestCaseMessage) => {
	  console.log("processing message", msgData);
	const writeImageData = await createImageWriter( msgData.outputDirectory );
	const testCase = unserializeTestCase( msgData.testCase );
	  // TODO check if test case is valid and skip if not
	const browser = await browserFactory.getBrowser(testCase);
	let testFunction;
	try {
		testFunction = getTestFunction( msgData.testFunction );
	} catch ( e ) {
		// TODO  send "metadataUpdate" msg with failed state of test case, using e.message
		console.log(e);
		return;
	}

	try {
		await testFunction(browser, testCase, writeImageData);
	} catch (e) {
		console.log(e);
	}
	// TODO use producer to send "metadataUpdate" msg with state of test case
	// TODO check if there is any trouble when using consumer and producer at the same time ...
});

