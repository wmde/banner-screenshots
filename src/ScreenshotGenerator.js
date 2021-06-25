import fs from "fs";
import {ConfigurationParser} from "./ConfigurationParser";
import path from "path";
import {createImageWriter} from "./writeImageData";

export class GenerateScreenshotsRequest {
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
	 * @param {GenerateScreenshotsRequest} request
	 * @returns {Promise<TestCase[]>}
	 */
	async generateScreenshots( request ) {
		const { outputDirectory, testCases } = this.initialize( request );
		await this.generateInBatches( testCases, request, outputDirectory );
		await this.writeMetaData( testCases, outputDirectory );

		return testCases;
	}

	/**
	 * @private
	 * @param {GenerateScreenshotsRequest} request
	 * @returns {{testCases: TestCase[], outputDirectory: string}}
	 */
	initialize( request ) {
		const config = fs.readFileSync( request.configPath );
		const parser = new ConfigurationParser( config.toString() );
		const outputDirectory = path.join( request.screenshotPath, parser.getCampaignTracking( request.campaignName ) );
		const testCaseGenerator = parser.generate( request.campaignName );
		const testCases = testCaseGenerator.getTestCases();

		return {
			testCases,
			outputDirectory
		}
	}

	/**
	 * @private
	 * @param {Array<TestCase>} testCases
	 * @param {GenerateScreenshotsRequest} request
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

	async writeMetaData(testCases, outputDirectory) {

		// TODO create TestCaseSerializer that converts TestCase into a format that's expected by Shutterbug (e.g. filename is broken at the moment)
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
	}
}
