import fs from "fs";
import partitionAll from 'partition-all';
import {BrowserFactory, SAUCELABS_CONNECTION} from "./src/BrowserFactory";
import {CapabilityFactory} from "./src/CapabilityFactory";
import {shootBanner} from "./src/test_functions/shootBanner";
import { ConfigurationParser } from "./src/ConfigurationParser";

// TODO read config file as an option and campaign name as an argument
const config = fs.readFileSync( __dirname + '/campaign_info.toml' );
const parser = new ConfigurationParser( config );
const testCaseGenerator = parser.generate( 'mobile' );

const CONCURRENT_REQUEST_LIMIT = 4;

(async () => {
	const browserFactory = new BrowserFactory( SAUCELABS_CONNECTION, new CapabilityFactory( { 'sauce:options': { recordVideo: false } } ) );

	const shoot = async testCase => {
		const browser = await browserFactory.getBrowser( testCase );
		return shootBanner( browser, testCase );
	};

	// Partition test matrix & wait for all async requests to finish, to prevent going over the saucelabs concurrent request limit
	const matrixBatches = partitionAll( CONCURRENT_REQUEST_LIMIT, testCaseGenerator.getValidTestCases() );
	for( let i = 0; i< matrixBatches.length; i++ ) {
		await Promise.all( matrixBatches[i].map( shoot ) )
	}

})().catch((e) => console.error(e));

