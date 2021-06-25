import fs from "fs";
import path from "path";
import { BrowserFactory, CONNECTION, factoryOptions } from "./src/TBBrowserFactory";
import {CapabilityFactory} from "./src/TBCapabilityFactory";
import {ConfigurationParser} from "./src/ConfigurationParser";
import {createImageWriter} from "./src/writeImageData";
import {TBBatchRunner} from "./src/TBRunTestInBatches";
import {CliRequestFactory} from "./src/CliRrequestFactory";

const METADATA_FILENAME = 'metadata.json';

const requestFactory = new CliRequestFactory( __dirname );

const {
	campaignName,
	configName,
	screenshotPath,
	concurrentRequestLimit,
	testFunction
} = requestFactory.getRequestParameters();

const config = fs.readFileSync( configName );
const parser = new ConfigurationParser( config.toString() );
const testCaseGenerator = parser.generate( campaignName );
const outputDirectory = path.join( screenshotPath, parser.getCampaignTracking( campaignName ) );

(async () => {
	const testCases = testCaseGenerator.getTestCases();
	const browserFactory = new BrowserFactory( CONNECTION,
		new CapabilityFactory( factoryOptions )
	);
	const imageWriter = await createImageWriter( outputDirectory );
	const batchRunner = new TBBatchRunner( browserFactory );

	/**
	 *
	 * @param {TestCase} testCase
	 * @param {Browser} browser
	 * @returns {Promise}
	 */
	const testFunctionWithImageWriter = async (testCase, browser ) => {
		try {
			await testFunction( browser, testCase, imageWriter );
		} catch( e ) {
			console.log( "browser error", e );
		}
	};

	await batchRunner.runTestsInBatches(concurrentRequestLimit, testCases, testFunctionWithImageWriter);

	testCases.map( testcase => {
		console.log( testcase.state.description, testcase.getName() );
	});

	// TODO iterate all testcases and generate metadata from them, including test case state to be displayed in Shutterbug

	// TODO create class/interface for metadata and the structure of the JSON-ified output (used by MetadataSummarizer)
	/*
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

	 */

})().catch((e) => console.error(e));

