import {TestCase} from './src/TestCase.js';
import {shootBanner} from './src/test_functions/shootBanner.js'
import { BrowserFactory, CONNECTION, factoryOptions } from "./src/TBBrowserFactory.js";
import {CapabilityFactory} from "./src/TBCapabilityFactory.js";
import {createImageWriter} from "./src/writeImageData.js";
import RabbitMQConsumer from "./src/MessageQueue/RabbitMQConsumer";
import {TestCaseMessage} from "./src/MessageQueue/Messages";
import {unserializeTestCase} from "./src/TestCaseSerializer";

const browserFactory = new BrowserFactory( CONNECTION,
	new CapabilityFactory( factoryOptions )
);

const consumer = new RabbitMQConsumer();

// TODO
// console.log("Connection established, hit Ctrl-C to quit worker");

// TODO create ScreenshotMessage type
consumer.consumeScreenshotQueue( async (msgData: TestCaseMessage) => {
	  console.log("processing message", msgData);
	const writeImageData = await createImageWriter( msgData.outputDirectory );
	const testCase = unserializeTestCase( msgData.testCase );
	  // TODO check if test case is valid and skip if not
	const browser = await browserFactory.getBrowser(testCase);
	  // TODO get test function from msgData and check it
	try {
		await shootBanner(browser, testCase, writeImageData);
	} catch (e) {
		console.log(e);
	}
	// TODO use producer to send "metadataUpdate" msg with state of test case
	// TODO check if there is any trouble when using consumer and producer at the same time ...
});

