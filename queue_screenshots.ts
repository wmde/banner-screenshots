import {QueueScreenshotsFromUrlCommand} from "./src/CommandLine/QueueScreenshotsFromUrlCommand";
import {ScreenshotGenerator} from "./src/ScreenshotGenerator.js";
import {TestCase} from "./src/Model/TestCase";
import RabbitMQConnection from "./src/MessageQueue/RabbitMQConnection";
import RabbitMQProducer from "./src/MessageQueue/RabbitMQProducer";

const command = new QueueScreenshotsFromUrlCommand();
const requestParameters = command.getRequestParameters();
const connection = new RabbitMQConnection( requestParameters.queueUrl );
const queue = new RabbitMQProducer( connection );
const screenshotGenerator = new ScreenshotGenerator( queue );

screenshotGenerator.generateQueuedScreenshots( requestParameters ).then(
	async ( testCases: TestCase[] ) => {
		console.log(`sent ${testCases.length} test cases to queue`);
		await connection.disconnect();
		process.exit(0);
	})
