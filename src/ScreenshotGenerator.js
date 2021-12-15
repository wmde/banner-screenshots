import fs from "fs";
import {ConfigurationParser} from "./ConfigurationParser";
import path from "path";
import { serializeTestCase } from "./Model/TestCaseSerializer";

export class ScreenshotsRequest {
	campaignName;
	configPath;
	screenshotPath;
	testFunction;

	/**
	 *
	 * @param {string} configPath Path to campaign configuration
	 * @param {string} screenshotPath Path to screenshots
	 * @param {string} campaignName campaign configuration section name, e.g. "desktop" or "mobile"
	 * @param {string} testFunctionName Name of test function
	 */
	constructor(configPath, screenshotPath, campaignName, testFunctionName ) {
		this.configPath = configPath;
		this.screenshotPath = screenshotPath;
		this.campaignName = campaignName;
		this.testFunction = testFunctionName;
	}
}

/**
 * This class is a use case that takes a ScreenshotsRequest, generates
 * a test matrix from it and sends screenshot and metadata commands to the queues.
 *
 */
export class ScreenshotGenerator {

	/**
	 * @param {QueueProducer} queueProducer
	 */
	constructor( queueProducer ) {
		this.queue = queueProducer;
	}

	/**
	 *
	 * @param {ScreenshotsRequest} request
	 * @returns {Promise<TestCase[]>}
	 */

	async generateQueuedScreenshots( request ) {
		const { trackingName, outputDirectory, testCases, dimensions } = this.initialize( request );

		// TODO send "initmetadata" message

		await Promise.all( testCases.map( tc => {
				/// TODO type with TestCaseMessage
				const msg = {
					testCase: serializeTestCase( tc ),
					testFunction: request.testFunction,
					trackingName,
					outputDirectory
				};
				return this.queue.sendTestCase( msg );
			  } ) )
		await this.queue.disconnect();
		// TODO better return type objects: testcases + metadata file name
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
}
