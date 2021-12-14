import {CliRequestFactory} from "./src/CliRequestFactory";
import {ScreenshotGenerator} from "./src/ScreenshotGenerator.js";
import {TestCase} from "./src/TestCase";
import EnvironmentConfig from "./src/EnvironmentConfig";
import RabbitMQProducer from "./src/MessageQueue/RabbitMQProducer";

const config = EnvironmentConfig.create();
const queue = new RabbitMQProducer( config.queueUrl );
const screenshotGenerator = new ScreenshotGenerator( queue );
const requestFactory = new CliRequestFactory( process.cwd() );

const requestParameters = requestFactory.getRequestParameters();
screenshotGenerator.generateQueuedScreenshots( requestParameters ).then(
	( testcases: TestCase[] ) => {
		console.log(`sent ${testcases.length} test cases to queue`);
		process.exit(0);
	})
