import { BrowserFactory, CONNECTION, factoryOptions } from "./src/TBBrowserFactory";
import {CapabilityFactory} from "./src/TBCapabilityFactory";
import {TBBatchRunner} from "./src/TBRunTestInBatches";
import {CliRequestFactory} from "./src/CliRrequestFactory";
import {ScreenshotGenerator} from "./src/ScreenshotGenerator";

const browserFactory = new BrowserFactory( CONNECTION,
	new CapabilityFactory( factoryOptions )
);
const batchRunner = new TBBatchRunner( browserFactory );
const screenshotGenerator = new ScreenshotGenerator( batchRunner );
const requestFactory = new CliRequestFactory( __dirname );

screenshotGenerator.generateScreenshots( requestFactory.getRequestParameters() )
	.catch( e => { console.log( e ) });

