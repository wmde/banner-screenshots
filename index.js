import partitionAll from 'partition-all';
import {BrowserFactory, SAUCELABS_CONNECTION} from "./src/BrowserFactory";
import {CapabilityFactory} from "./src/CapabilityFactory";
import {BROWSER, OPERATING_SYSTEM, TestMatrix} from "./src/TestMatrix";
import {shootBanner} from "./src/test_functions/shootBanner";
import {browserSpy} from "./src/test_functions/browserSpy";

// TODO get matrix from config file
const matrix = new TestMatrix();
matrix.addDimension( BROWSER, [ 'ie11', 'edge', 'safari', 'chrome', 'firefox' ] )
	.addDimension( OPERATING_SYSTEM, [ 'win7', 'win10', 'macos', 'linux' ])
	.build();

const CONCURRENT_REQUEST_LIMIT = 4;

(async () => {
	const browserFactory = new BrowserFactory( SAUCELABS_CONNECTION, new CapabilityFactory( {} ) );

	const shoot = async dimensions => {
		const browser = await browserFactory.getBrowser( matrix.getDimensionMap( dimensions ) );
		// TODO replace with shootBanner
		return browserSpy( browser );
	};

	// Partition test matrix & wait for all async requests to finish, to prevent going over the saucelabs concurrent request limit
	const matrixBatches = partitionAll( CONCURRENT_REQUEST_LIMIT, matrix.getDimensionArray() );
	for( let i = 0; i< matrixBatches.length; i++ ) {
		await Promise.all( matrixBatches[i].map( shoot ) )
	}

})().catch((e) => console.error(e))
