import fs from "fs";
import {ConfigurationParser} from "./ConfigurationParser";
import path from "path";
import {serializeMapToArray} from "./serializeMapToArray.js";
import {TestCaseSerializer} from "./TestcaseMetadata.js";
import {serializeTestCase} from "./TestCaseSerializer";

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

	/**
	 * @param {TestCase[]} testCases
	 * @param {string} outputDirectory
	 * @param {string} trackingName
	 * @param {Map<string,string[]>} dimensions
	 * @todo move into worker script
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
