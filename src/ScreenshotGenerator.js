import fs from "fs";
import {ConfigurationParser} from "./ConfigurationParser";
import path from "path";
import {createImageWriter} from "./writeImageData.js";
import {serializeMapToArray} from "./serializeMapToArray.js";
import {TestCaseSerializer} from "./TestcaseMetadata.js";

const METADATA_FILENAME = 'metadata.json';

export class ScreenshotsRequest {
	campaignName;
	configPath;
	screenshotPath;
	concurrentRequestLimit;
	testFunction;

	/**
	 *
	 * @param {string} configPath Path to campaign configuration
	 * @param {string} screenshotPath Path to screenshots
	 * @param {string} campaignName campaign configuration section name, e.g. "desktop" or "mobile"
	 * @param {number} concurrentRequestLimit Maximum of concurrent requests to test service
	 * @param {function} testFunction Code of test function
	 */
	constructor(configPath, screenshotPath, campaignName, concurrentRequestLimit, testFunction) {
		this.configPath = configPath;
		this.screenshotPath = screenshotPath;
		this.campaignName = campaignName;
		this.concurrentRequestLimit = concurrentRequestLimit;
		this.testFunction = testFunction;
	}
}


export class ScreenshotGenerator {

	constructor( batchRunner ) {
		this.batchRunner = batchRunner;
	}

	/**
	 *
	 * @param {ScreenshotsRequest} request
	 * @returns {Promise<TestCase[]>}
	 */
	async generateScreenshots( request ) {
		const { trackingName, outputDirectory, testCases, dimensions } = this.initialize( request );
		await this.generateInBatches( testCases, request, outputDirectory );
		this.writeMetaData( testCases, outputDirectory, trackingName, dimensions );

		return testCases;
	}

	/**
	 * @private
	 * @param {ScreenshotsRequest} request
	 * @returns {{testCases: TestCase[], outputDirectory: string, trackingName: string, dimensions: Map<string,string[]>}}
	 */
	initialize( request ) {
		const config = fs.readFileSync( request.configPath );
		const parser = new ConfigurationParser( config.toString() );
		const trackingName = parser.getCampaignTracking( request.campaignName );
		const outputDirectory = path.join( request.screenshotPath, trackingName );
		const testCaseGenerator = parser.generate( request.campaignName );
		const testCases = testCaseGenerator.getTestCases();

		return {
			trackingName,
			testCases,
			outputDirectory,
			dimensions: testCaseGenerator.dimensions
		}
	}

	/**
	 * @private
	 * @param {Array<TestCase>} testCases
	 * @param {ScreenshotsRequest} request
	 * @param {string} outputDirectory
	 * @returns {Promise<void>}
	 */
	async generateInBatches( testCases, request, outputDirectory ) {
		const imageWriter = await createImageWriter( outputDirectory );

		/**
		 * @param {TestCase} testCase
		 * @param {Browser} browser
		 * @returns {Promise}
		 */
		const testFunctionWithImageWriter = async (testCase, browser ) => {
			try {
				await request.testFunction( browser, testCase, imageWriter );
			} catch( e ) {
				console.log( "browser error", e );
			}
		};

		await this.batchRunner.runTestsInBatches( request.concurrentRequestLimit, testCases, testFunctionWithImageWriter );
	}

	/**
	 * @param {TestCase[]} testCases
	 * @param {string} outputDirectory
	 * @param {string} trackingName
	 * @param {Map<string,string[]>} dimensions
	 */
	writeMetaData( testCases, outputDirectory, trackingName, dimensions ) {
		const testCaseSerializer = new TestCaseSerializer();
		const metadata = {
			createdOn: Date.now(),
			campaign: trackingName,
			dimensions: dimensions,
			testCases: testCaseSerializer.serializeTestCases( testCases )
		};

		fs.writeFileSync(
			path.join( outputDirectory, METADATA_FILENAME ),
			JSON.stringify( metadata, serializeMapToArray, 4 )
		);
	}
}
