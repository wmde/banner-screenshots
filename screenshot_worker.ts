import { BrowserFactory, DEFAULT_CONNECTION_PARAMS, factoryOptions } from "./src/TBBrowserFactory.js";
import {CapabilityFactory} from "./src/TBCapabilityFactory.js";
import {createImageWriter} from "./src/writeImageData.js";
import RabbitMQConsumer from "./src/MessageQueue/RabbitMQConsumer";
import {TestCaseMessage} from "./src/MessageQueue/Messages";
import {serializeTestCase, unserializeTestCase} from "./src/Model/TestCaseSerializer";
import EnvironmentConfig from "./src/EnvironmentConfig";
import { getTestFunction } from "./src/test_functions";
import RabbitMQProducer from "./src/MessageQueue/RabbitMQProducer";
import {TestCase, TestCaseFailedState, TestCaseFinishedState} from "./src/Model/TestCase";
import RabbitMQConnection from "./src/MessageQueue/RabbitMQConnection";

const config = EnvironmentConfig.create();

const connectionOptions = {
	...DEFAULT_CONNECTION_PARAMS,
	user: config.testingBotApiKey,
	key: config.testingBotApiSecret
}

const browserFactory = new BrowserFactory( connectionOptions,
	new CapabilityFactory( factoryOptions )
);

const queueConnection = new RabbitMQConnection( config.queueUrl );
const consumer = new RabbitMQConsumer( queueConnection, "Connection established, hit Ctrl-C to quit worker" );
const producer = new RabbitMQProducer( queueConnection );


const sendMetadataUpdate = async ( testCase: TestCase, campaignName: string ): Promise<void> =>
	producer.sendMetadataUpdate( {
		msgType: "update",
		testCase: serializeTestCase( testCase ),
		campaignName
	} );

consumer.consumeScreenshotQueue( async (msgData: TestCaseMessage) => {
	const writeImageData = await createImageWriter( msgData.outputDirectory );
	const testCase = unserializeTestCase( msgData.testCase );
	  // TODO check if test case is valid and skip if not
	const browser = await browserFactory.getBrowser(testCase);
	let testFunction;
	try {
		testFunction = getTestFunction( msgData.testFunction );
	} catch ( e ) {
		testCase.updateState( new TestCaseFailedState( 'Test function failed with error', e ) );
		await sendMetadataUpdate( testCase, msgData.trackingName );
		console.log(e);
		return;
	}

	try {
		await testFunction(browser, testCase, writeImageData);
	} catch (e) {
		console.log(e);
	}

	testCase.updateState( new TestCaseFinishedState( 'Finished' ) );
	await sendMetadataUpdate( testCase, msgData.trackingName );
});

