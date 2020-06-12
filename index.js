import fs from "fs";
import path from "path";
import partitionAll from 'partition-all';
import {BrowserFactory, SAUCELABS_CONNECTION} from "./src/BrowserFactory";
import {CapabilityFactory} from "./src/CapabilityFactory";
import testFunctions from "./src/test_functions";
import {ConfigurationParser} from "./src/ConfigurationParser";
import {createImageWriter} from "./src/writeImageData";
import {serializeMapToArray} from "./src/serializeMapToArray";

const METADATA_FILENAME = 'metadata.json';

// TODO read the following parameters from command line options (with campaignName as required argument, everything else optional with default)
const campaignName = 'desktop02';
const screenshotPath = path.join( __dirname, 'banner-shots' );
const configName = path.join( __dirname, 'campaign_info.toml' );
const concurrentRequestLimit = 4;
const testFunctionName = 'shootOldBanner';

if (typeof testFunctions[testFunctionName] !== 'function' ) {
	console.log( `Unknown test function "${ testFunctionName }"` );
	process.exit( 2 );
}
const shootBanner = testFunctions[testFunctionName];
const config = fs.readFileSync( configName );
const parser = new ConfigurationParser( config.toString() );
const testCaseGenerator = parser.generate( campaignName );
const outputDirectory = path.join( screenshotPath, parser.getCampaignTracking( campaignName ) );

(async () => {
	const browserFactory = new BrowserFactory( SAUCELABS_CONNECTION, new CapabilityFactory( { 'sauce:options': { recordVideo: false } } ) );
	const imageWriter = await createImageWriter( outputDirectory );

	const shoot = async testCase => {
		let browser;
		try {
			browser = await browserFactory.getBrowser( testCase );
		} catch( e ) {
			console.log( `Error creating browser instance for banner ${ testCase.getScreenshotFilename() }` );
			// TODO mark testCase as failed
			return testCase
		}
		try {
			await shootBanner( browser, testCase, imageWriter );
		} catch( e ) {
			console.log( `Error while generating screenshot for banner ${ testCase.getScreenshotFilename() }`, e );
			// TODO mark testCase as failed
		}
		return testCase;
	};

	// Partition test case array & wait for all async requests to finish, to prevent going over the saucelabs concurrent request limit
	const matrixBatches = partitionAll( concurrentRequestLimit, testCaseGenerator.getValidTestCases() );
	for( let i = 0; i< matrixBatches.length; i++ ) {
		await Promise.all( matrixBatches[i].map( shoot ) )
	}

	// TODO iterate over the returned test cases to write the "failed" status into the metadata

	// TODO create class/interface for metadata and the structure of the JSON-ified output (used by MetadataSummarizer)
	const metadata = {
		createdOn: Date.now(),
		campaign: parser.getCampaignTracking( campaignName ),
		dimensions: testCaseGenerator.dimensions,
		testCases: testCaseGenerator.getTestCases() // get all test cases to be able to generate a grid
	};
	fs.writeFileSync(
		path.join( outputDirectory, METADATA_FILENAME ),
		JSON.stringify( metadata, serializeMapToArray, 4 )
	);

})().catch((e) => console.error(e));

