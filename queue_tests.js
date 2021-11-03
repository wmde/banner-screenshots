import { URL } from 'url';
import {CliRequestFactory} from "./src/CliRequestFactory.js";
import {ScreenshotGenerator} from "./src/ScreenshotGenerator.js";

const screenshotGenerator = new ScreenshotGenerator();
const requestFactory = new CliRequestFactory( new URL( '.', import.meta.url ).pathname );

const requestParameters = requestFactory.getRequestParameters();
const testcases = await screenshotGenerator.generateQueuedScreenshots( requestParameters );
console.log(`sent ${testcases.length} test cases to queue`);
process.exit(0); 
