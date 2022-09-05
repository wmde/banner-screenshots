import { BrowserFactory, DEFAULT_CONNECTION_PARAMS, factoryOptions } from "./src/TBBrowserFactory.js";
import {CapabilityFactory} from "./src/TBCapabilityFactory.js";
import {createImageWriter} from "./src/writeImageData.js";
import RabbitMQConsumer from "./src/MessageQueue/RabbitMQConsumer";
import {TestCaseMessage} from "./src/MessageQueue/Messages";
import {serializeTestCase, unserializeTestCase} from "./src/Model/TestCaseSerializer";
import EnvironmentConfig from "./src/EnvironmentConfig";
import { getTestFunction } from "./src/test_functions";
import RabbitMQProducer from "./src/MessageQueue/RabbitMQProducer";
import { TestCase, TestCaseState, TestCaseFailedState } from "./src/Model/TestCase";
import RabbitMQConnection from "./src/MessageQueue/RabbitMQConnection";
import path from "path";
import process from "process";
import {WorkerConfigFactory} from "./src/CommandLine/WorkerConfig";

process.umask(0o002);

const config = new EnvironmentConfig();
const cliConfig = new WorkerConfigFactory();

const connectionOptions = {
	...DEFAULT_CONNECTION_PARAMS,
	user: config.testingBotApiKey,
	key: config.testingBotApiSecret
}

const browserFactory = new BrowserFactory( connectionOptions,
	new CapabilityFactory( factoryOptions )
);

const options = cliConfig.getConfig( 'A queue worker that processes screenshot messages', process.cwd() );
const showMessage = options.verbose ? console.log : () => {};
const queueConnection = new RabbitMQConnection( config.queueUrl, "Connection established, hit Ctrl-C to quit worker" );
const consumer = new RabbitMQConsumer( queueConnection );
const producer = new RabbitMQProducer( queueConnection );

// Send a message with the updated test case to the metadata worker.
// The screenshot worker and the test function update the test case state (from "pending" to "running" to "finished"/"failed")
const sendMetadataUpdate = async ( testCase: TestCase, campaignName: string ): Promise<void> =>
	producer.sendMetadataUpdate( {
		msgType: "update",
		testCase: serializeTestCase( testCase ),
		campaignName
	} );

// Create a function that updates the test state and saves the test state on transitions
// Also logs state description updates and transitions if verbosity is on
const getTestCaseStateChangeFunction = ( campaignName: string ) => 
	async ( testCase: TestCase, newState: TestCaseState ): Promise<void> => {
		const oldStateName = testCase.getLastStateName();

		testCase.updateState( newState );

		let msg = `Test case state update: ${testCase.getName()} - ${newState.description}`;
		// Write metadata to file on state change
		if ( oldStateName !== newState.stateName ) {
			msg = `Test case state transition: ${testCase.getName()}- ${oldStateName} to ${newState.stateName} - ${newState.description}`;
			await sendMetadataUpdate( testCase, campaignName )
		}
		showMessage( msg );
	}


consumer.consumeScreenshotQueue( async (msgData: TestCaseMessage) => {
	const writeImageData = await createImageWriter( path.join( options.outputPath, msgData.trackingName ) );
	const testCase = unserializeTestCase( msgData.testCase );
	const onTestCaseStateChange = getTestCaseStateChangeFunction( msgData.trackingName )

	showMessage( `Creating a browser instance for test ${testCase.getName()}` );
	const browser = await browserFactory.getBrowser(testCase);

	showMessage( `Taking screenshot for test ${testCase.getName()}` );
	let testFunction;
	try {
		testFunction = getTestFunction( msgData.testFunction );
	} catch ( e ) {
		onTestCaseStateChange( testCase, new TestCaseFailedState( e.message ) );
		return;
	}

	try {
		await testFunction( browser, testCase, writeImageData, onTestCaseStateChange );
	} catch (e) {
		onTestCaseStateChange( testCase, new TestCaseFailedState( e.message ) );
	}

});

