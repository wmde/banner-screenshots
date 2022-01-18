import fs from "fs";
import {ConfigurationParser} from "./ConfigurationParser";
import { serializeTestCase } from "./Model/TestCaseSerializer";
import {serializeDimensionsToEntries} from "./Model/MetadataSerializer";

export class ScreenshotsRequest {
	campaignName;
	configPath;
	testFunction;

	/**
	 *
	 * @param {string} configPath Path to campaign configuration
	 * @param {string} campaignName campaign configuration section name, e.g. "desktop" or "mobile"
	 * @param {string} testFunctionName Name of test function
	 */
	constructor(configPath, campaignName, testFunctionName ) {
		this.configPath = configPath;
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
		const { trackingName, testCases, dimensions } = this.initialize( request );
		const serializedTestCases = testCases.map( serializeTestCase );

		await this.queue.sendInitializeMetadata( {
			msgType: 'init',
			testCases: serializedTestCases,
			dimensions: serializeDimensionsToEntries( dimensions ),
			campaignName: trackingName
		} );

		await Promise.all( serializedTestCases.map( tc => {
				const msg = {
					testCase: tc,
					testFunction: request.testFunction,
					trackingName,
				};
				return this.queue.sendTestCase( msg );
			  } ) );
		// TODO better return type objects: testcases + metadata file name
		return testCases;
	}

	/**
	 * @private
	 * @param {ScreenshotsRequest} request
	 * @returns {{testCases: TestCase[], outputDirectory: string, trackingName: string, dimensions: Dimensions}}
	 */
	initialize( request ) {
		const config = fs.readFileSync( request.configPath );
		const parser = new ConfigurationParser( config.toString() );
		const trackingName = parser.getCampaignTracking( request.campaignName );
		const testCaseGenerator = parser.generate( request.campaignName );
		const testCases = testCaseGenerator.getTestCases();

		return {
			trackingName,
			testCases,
			dimensions: testCaseGenerator.dimensions
		}
	}
}
