import { Command } from 'commander';
import * as path from "path";
import { testFunctionExists } from "../test_functions";
import { ConfigReader } from '../ConfigReader/ConfigReaderInterface'

export class ScreenshotsRequest {
	readonly configReader: ConfigReader;
	readonly campaignName: string;
	readonly testFunction: string;
	readonly queueUrl: string;

	constructor( configReader: ConfigReader, campaignName: string, testFunctionName: string, queueUrl: string ) {
		this.configReader = configReader;
		this.campaignName = campaignName;
		this.testFunction = testFunctionName;
		this.queueUrl = queueUrl;
	}
}

