import {ScreenshotsRequestFactory} from "./src/CommandLine/ScreenshotRequest";
import {ScreenshotGenerator} from "./src/ScreenshotGenerator.js";
import {TestCase} from "./src/Model/TestCase";
import RabbitMQConnection from "./src/MessageQueue/RabbitMQConnection";
import RabbitMQProducer from "./src/MessageQueue/RabbitMQProducer";

const requestFactory = new ScreenshotsRequestFactory( process.cwd() );
const requestParameters = requestFactory.getRequestParameters();
const connection = new RabbitMQConnection( requestParameters.queueUrl );
const queue = new RabbitMQProducer( connection );
const screenshotGenerator = new ScreenshotGenerator( queue );

screenshotGenerator.generateQueuedScreenshots( requestParameters ).then(
	async ( testcases: TestCase[] ) => {
		console.log(`sent ${testcases.length} test cases to queue`);
		await connection.disconnect();
		process.exit(0);
	})
