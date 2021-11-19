import {CliRequestFactory} from "./src/CliRequestFactory";
import {ScreenshotGenerator} from "./src/ScreenshotGenerator.js";
import {TestCase} from "./src/TestCase";

const screenshotGenerator = new ScreenshotGenerator();
const requestFactory = new CliRequestFactory( process.cwd() );

const requestParameters = requestFactory.getRequestParameters();
screenshotGenerator.generateQueuedScreenshots( requestParameters ).then(
	( testcases: TestCase[] ) => {
		console.log(`sent ${testcases.length} test cases to queue`);
		process.exit(0);
	})
