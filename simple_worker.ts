// A simple "message echo" worker to test the server

import RabbitMQConsumer from "./src/MessageQueue/RabbitMQConsumer";
import {TestCaseMessage} from "./src/MessageQueue/Messages";
import EnvironmentConfig from "./src/EnvironmentConfig";
import {TestCase, TestCaseFinishedState} from "./src/Model/TestCase";
import RabbitMQProducer from "./src/MessageQueue/RabbitMQProducer";
import {serializeTestCase, unserializeTestCase} from "./src/Model/TestCaseSerializer";
import RabbitMQConnection from "./src/MessageQueue/RabbitMQConnection";

const config = new EnvironmentConfig();

const TASK_DELAY = 500;

const queueConnection = new RabbitMQConnection( config.queueUrl, "Connection established, hit Ctrl-C to quit worker" );
const consumer = new RabbitMQConsumer( queueConnection );
const producer = new RabbitMQProducer( queueConnection );

async function sendMetadataUpdate( testCase: TestCase, campaignName: string  ): Promise<void> {
	await producer.sendMetadataUpdate( {
		msgType: "update",
		testCase: serializeTestCase( testCase ),
		campaignName
	} );
}

// "consume" will run in an endless loop, where the client waits for new messages
consumer.consumeScreenshotQueue( async function( msgData: TestCaseMessage ) {
  	console.log("processing message", msgData);
	console.log('started at', new Date());
	const testCase = unserializeTestCase( msgData.testCase );

	return new Promise<void>( (resolve) => setTimeout( async () => {
		console.log("processing finished at", new Date());
		testCase.updateState( new TestCaseFinishedState( 'Finished' ) );
		await sendMetadataUpdate( testCase, msgData.trackingName );
		resolve();
	  }, TASK_DELAY ) );
});


