// A simple "message echo" worker to test the server
import RabbitMQConsumer from "./src/MessageQueue/RabbitMQConsumer";
import {TestCaseMessage} from "./src/MessageQueue/Messages";
import EnvironmentConfig from "./src/EnvironmentConfig";

const config = EnvironmentConfig.create();

const TASK_DELAY = 3000;

const consumer = new RabbitMQConsumer( config.queueUrl );

// console.log("Connection established, hit Ctrl-C to quit worker");

// "consume" will run in an endless loop, where the client waits for new messages
consumer.consumeScreenshotQueue( async function( msg: TestCaseMessage ) {
  	console.log("processing message", msg);
	console.log('started at', new Date())
	return new Promise<void>( (resolve) => setTimeout( () => {
		  console.log("processing finished at", new Date());
		  resolve();
	  }, TASK_DELAY ) );
});


