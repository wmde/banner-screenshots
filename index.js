import fs from "fs";
import path from "path";
import partitionAll from 'partition-all';
import {BrowserFactory, SAUCELABS_CONNECTION} from "./src/BrowserFactory";
import {CapabilityFactory} from "./src/CapabilityFactory";
import {shootBanner} from "./src/test_functions/shootBanner";
import { ConfigurationParser } from "./src/ConfigurationParser";
import {createImageWriter} from "./src/writeImageData";

// TODO read the following parameters from command line options (with campaignName as required argument, everything else optional with default)
const campaignName = 'test';
const screenshotPath = path.join( __dirname, 'banner-shots' );
const configName = path.join( __dirname, 'campaign_info.toml' );
const concurrentRequestLimit = 4;

const config = fs.readFileSync( configName );
const parser = new ConfigurationParser( config.toString() );
const testCaseGenerator = parser.generate( campaignName );

(async () => {
	const browserFactory = new BrowserFactory( SAUCELABS_CONNECTION, new CapabilityFactory( { 'sauce:options': { recordVideo: false } } ) );
	const imageWriter = await createImageWriter( path.join( screenshotPath, parser.getCampaignTracking( campaignName ) ) );

	const shoot = async testCase => {
		const browser = await browserFactory.getBrowser( testCase );
		return shootBanner( browser, testCase, imageWriter );
	};

	// Partition test matrix & wait for all async requests to finish, to prevent going over the saucelabs concurrent request limit
	const matrixBatches = partitionAll( concurrentRequestLimit, testCaseGenerator.getValidTestCases() );
	for( let i = 0; i< matrixBatches.length; i++ ) {
		await Promise.all( matrixBatches[i].map( shoot ) )
	}

})().catch((e) => console.error(e));

