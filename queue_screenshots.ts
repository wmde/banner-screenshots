import {CliRequestFactory} from "./src/CommandLine/CliRequestFactory";
import {ScreenshotGenerator} from "./src/ScreenshotGenerator.js";
import {TestCase} from "./src/Model/TestCase";
import EnvironmentConfig from "./src/EnvironmentConfig";
import RabbitMQConnection from "./src/MessageQueue/RabbitMQConnection";
import RabbitMQProducer from "./src/MessageQueue/RabbitMQProducer";

const config = new EnvironmentConfig();
const connection = new RabbitMQConnection( config.queueUrl );
const queue = new RabbitMQProducer( connection );
const screenshotGenerator = new ScreenshotGenerator( queue );
const requestFactory = new CliRequestFactory( process.cwd() );

const requestParameters = requestFactory.getRequestParameters();
screenshotGenerator.generateQueuedScreenshots( requestParameters ).then(
	async ( testcases: TestCase[] ) => {
		console.log(`sent ${testcases.length} test cases to queue`);
		await connection.disconnect();
		process.exit(0);
	})
