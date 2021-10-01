import { URL } from 'url';
import { BrowserFactory, CONNECTION, factoryOptions } from "./src/TBBrowserFactory.js";
import {CapabilityFactory} from "./src/TBCapabilityFactory.js";
import {TBBatchRunner} from "./src/TBBatchRunner.js";
import {CliRequestFactory} from "./src/CliRequestFactory.js";
import {ScreenshotGenerator} from "./src/ScreenshotGenerator.js";

const browserFactory = new BrowserFactory( CONNECTION,
	new CapabilityFactory( factoryOptions )
);
const batchRunner = new TBBatchRunner( browserFactory );
const screenshotGenerator = new ScreenshotGenerator( batchRunner );
const requestFactory = new CliRequestFactory( new URL( '.', import.meta.url ).pathname );

screenshotGenerator.generateScreenshots( requestFactory.getRequestParameters() )
	.then ( testcases => {
		const resultCounts = testcases.reduce(
			(counts, testcase) => {
				if ( !testcase.isValid() ) {
					return {
						...counts,
						invalid: counts.invalid + 1
					}
				}
				if ( !testcase.state.finished ) {
					return {
						...counts,
						error: counts.error + 1,
						messages: [...counts.messages, testcase.state.description ]
					}
				}
				return {
					...counts,
					success: counts.success + 1
				}
			},
			{success: 0, invalid: 0, error: 0, messages: []}
		);
		if (resultCounts.success > 0 ) {
			console.log( `Successfully took ${resultCounts.success} screenshots` );
		}
		if (resultCounts.invalid > 0 ) {
			console.log( `Ignored ${resultCounts.invalid} unsupported test cases` );
		}
		if (resultCounts.error > 0 ) {
			console.log( `${resultCounts.error} errors occurred. Last known state from each errored test case:` );
			resultCounts.messages.map( m => console.log( m ) );
		}
	})
	.catch( e => { console.log( e ) });

