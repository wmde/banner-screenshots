import { BrowserFactory, DEFAULT_CONNECTION_PARAMS, factoryOptions } from "./src/TBBrowserFactory.js";
import {CapabilityFactory} from "./src/TBCapabilityFactory.js";
import {createImageWriter} from "./src/writeImageData.js";
import RabbitMQConsumer from "./src/MessageQueue/RabbitMQConsumer";
import {TestCaseMessage} from "./src/MessageQueue/Messages";
import {serializeTestCase, unserializeTestCase} from "./src/Model/TestCaseSerializer";
import EnvironmentConfig from "./src/EnvironmentConfig";
import { getTestFunction } from "./src/test_functions";
import RabbitMQProducer from "./src/MessageQueue/RabbitMQProducer";
import { TestCase, TestCaseFailedState } from "./src/Model/TestCase";
import RabbitMQConnection from "./src/MessageQueue/RabbitMQConnection";
import {Command} from "commander";

const config = new EnvironmentConfig();

const connectionOptions = {
	...DEFAULT_CONNECTION_PARAMS,
	user: config.testingBotApiKey,
	key: config.testingBotApiSecret
}

const browserFactory = new BrowserFactory( connectionOptions,
	new CapabilityFactory( factoryOptions )
);

const program = new Command();
program.description( 'A queue worker that processes screenshot messages' );
program.option('-v --verbose', 'Show output');
program.showHelpAfterError();
program.parse();

const options = program.opts();
const showMessage = options.verbose ? console.log : () => {};
const queueConnection = new RabbitMQConnection( config.queueUrl, "Connection established, hit Ctrl-C to quit worker" );
const consumer = new RabbitMQConsumer( queueConnection );
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
	showMessage( `Creating a browser instance for test ${testCase.getName()}` );
	const browser = await browserFactory.getBrowser(testCase);
	showMessage( `Taking screenshot for test ${testCase.getName()}` );
	let testFunction;
	try {
		testFunction = getTestFunction( msgData.testFunction );
	} catch ( e ) {
		testCase.updateState( new TestCaseFailedState( 'Test function failed with error', e ) );
		await sendMetadataUpdate( testCase, msgData.trackingName );
		showMessage( e.message );
		return;
	}

	try {
		// test function will update the state of testCase
		await testFunction( browser, testCase, writeImageData );
	} catch (e) {
		testCase.updateState( new TestCaseFailedState( e.message ) );
		showMessage( e.message );
		return;
	}

	await sendMetadataUpdate( testCase, msgData.trackingName );
});

