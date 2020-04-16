import fs from "fs";
import partitionAll from 'partition-all';
import {BrowserFactory, SAUCELABS_CONNECTION} from "./src/BrowserFactory";
import {CapabilityFactory} from "./src/CapabilityFactory";
import {BROWSER, OPERATING_SYSTEM, RESOLUTION, TestCaseGenerator} from "./src/TestCaseGenerator";
import {shootBanner} from "./src/test_functions/shootBanner";
import {browserSpy} from "./src/test_functions/browserSpy";
import { ConfigurationParser } from "./src/ConfigurationParser";


const config = fs.readFileSync( __dirname + '/campaign_info.toml' );
const parser = new ConfigurationParser( config );
const testCaseGenerator = parser.generate( 'desktop' );

const CONCURRENT_REQUEST_LIMIT = 4;

(async () => {
	const browserFactory = new BrowserFactory( SAUCELABS_CONNECTION, new CapabilityFactory( { 'sauce:options': { recordVideo: false } } ) );

	const shoot = async testCase => {
		const browser = await browserFactory.getBrowser( testCase );
		// TODO replace with shootBanner
		return browserSpy( browser, testCase );
	};

	// Partition test matrix & wait for all async requests to finish, to prevent going over the saucelabs concurrent request limit
	const matrixBatches = partitionAll( CONCURRENT_REQUEST_LIMIT, testCaseGenerator.getValidTestCases() );
	for( let i = 0; i< matrixBatches.length; i++ ) {
		await Promise.all( matrixBatches[i].map( shoot ) )
	}

})().catch((e) => console.error(e));

